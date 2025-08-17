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

export const fetchActiveCompanyData = createAsyncThunk('companyActive/fetchActiveCompanyData', async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}company/active-company`,
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


export const companyActive = createSlice({
    name: 'companyActive',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchActiveCompanyData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default companyActive.reducer
