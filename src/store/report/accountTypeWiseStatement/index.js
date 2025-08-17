import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Payment Transaction
export const filterAccountTypeWiseData = createAsyncThunk('accountTypeWiseStatement/filterAccountTypeWiseData', async data => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}report/filter-accountTypeReport`, {
        startDate: data.startDate,
        endDate: data.endDate,
        groupTypeIds: data.groupTypeIds,
        clientTypeIds: data.clientTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        accountTypeIds: data.accountTypeIds,
        accountIds : data.accountIds
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


export const accountTypeWiseStatement = createSlice({
    name: 'accountTypeWiseStatement',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(filterAccountTypeWiseData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default accountTypeWiseStatement.reducer
