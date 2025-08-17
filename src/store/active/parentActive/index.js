import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Payment Transaction

export const fetchActiveParentData = createAsyncThunk('parentActive/fetchActiveParentData', async (params) => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}parentmenu/active-parentmenu`,
        {
            params,
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        },
    )
    return response.data
})


export const parentActive = createSlice({
    name: 'parentActive',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchActiveParentData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default parentActive.reducer
