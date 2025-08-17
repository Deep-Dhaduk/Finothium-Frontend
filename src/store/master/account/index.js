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


// ** Fetch Account
export const fetchAccountData = createAsyncThunk('accountMaster/fetchAccountData', async params => {
    const token = getToken()

    const response = await axios.get(`${apiBaseUrl}account/list-account`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
})

// ** Add Account
export const addAccount = createAsyncThunk('accountMaster/addAccount', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}account/create-account`, {
        account_name: data.accountName,
        group_name_Id: data.accountGroup,
        join_date: data.joinDate,
        exit_date: data.exitDate,
        account_type_Id: data.accountType,
        status: data.status,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchAccountData(getState().account.params))
    return response.data
})

// ** Update Account
export const updateAccount = createAsyncThunk('accountMaster/updateAccount', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}account/update-account/${data.id}`, {
            account_name: data.account_name,
            group_name_Id: data.group_name_Id,
            join_date: data.joinDate,
            exit_date: data.exitDate,
            account_type_Id: data.account_type_Id,
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

        // Dispatch the fetchAccountData action with the updated parameters
        dispatch(fetchAccountData(getState().account.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Account
export const deleteAccount = createAsyncThunk('accountMaster/deleteAccount', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}account/delete-account/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchAccountData(getState().account.params))
    return response.data
})

export const masterAccountGroupSlice = createSlice({
    name: 'accountMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchAccountData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterAccountGroupSlice.reducer
