import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'


// ** Axios Imports
import axios from 'axios'
import { account_Group } from 'src/varibles/constant';
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
export const fetchActiveAccountGroupData = createAsyncThunk('activeAccountGroup/fetchActiveAccountGroupData', async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}common/active-common`, {
        type: data.type
    },
        {
            // params,
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        },
    )
    return response.data
})


export const masterAccountGroupSlice = createSlice({
    name: 'activeAccountGroup',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchActiveAccountGroupData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterAccountGroupSlice.reducer
