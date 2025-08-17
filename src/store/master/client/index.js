import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'


// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Get User Data
const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}

// ** Fetch Client Data
export const fetchClientData = createAsyncThunk('clientMaster/fetchClientData', async (data) => {
    const token = getToken()

    const response = await axios.post(`${apiBaseUrl}client/list-client`, {
        type: data.type,
    }, {
        params: data.params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
})

// ** Add Client Data
export const addClient = createAsyncThunk('clientMaster/addClient', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}client/create-client`, {
        clientName: data.name,
        status: data.status,
        type: data.type,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchClientData({ type: data.type }))
    return response.data
})

// ** Update Client Data
export const updateClient = createAsyncThunk('clientMaster/updateClient', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}client/update-client/${data.id}`, {
            clientName: data.name,
            type: data.type,
            status: data.status,
            createdBy: userData.id,
            updatedBy: userData.id
        },
            {
                headers: {
                    // 'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

        // Dispatch the fetchClientData action with the updated parameters
        dispatch(fetchClientData({ type: data.type }));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Client Data
export const deleteClient = createAsyncThunk('clientMaster/deleteClient', async (data, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}client/delete-client/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchClientData({ type: data.type }))
    return response.data
})

export const masterClientSlice = createSlice({
    name: 'clientMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchClientData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterClientSlice.reducer
