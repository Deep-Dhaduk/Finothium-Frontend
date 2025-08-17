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
export const fetchCommonData = createAsyncThunk('commonMaster/fetchCommonData', async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}common/list-common`, {
        type: data.type
    },
        {
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
export const addCommonMenu = createAsyncThunk('commonMaster/addCommonMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}common/create-common`, {
        name: data.name, type: data.type, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchCommonData({ type: data.type }))
    return response.data
})

// ** Update Client Data
export const updateCommonMenu = createAsyncThunk('commonMaster/updateCommonMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}common/update-common/${data.id}`, {
            name: data.name, type: data.type, status: data.status, createdBy: userData.id, updatedBy: userData.id
        },
            {
                headers: {
                    // 'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

        // Dispatch the fetchCommonData action with the updated parameters
        dispatch(fetchCommonData({ type: data.type }));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Client Data
export const deleteCommon = createAsyncThunk('commonMaster/deleteCommon', async (data, { getState, dispatch }) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}common/delete-common/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchCommonData({ type: data.type }))
    return response.data
})

export const masterClientSlice = createSlice({
    name: 'commonMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCommonData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterClientSlice.reducer
