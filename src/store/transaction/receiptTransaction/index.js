import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { receipt } from 'src/varibles/constant';
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Get User Data
const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}

// ** Fetch Payment Transaction
export const fetchReceiptTransactionData = createAsyncThunk('transactionMaster/fetchReceiptTransactionData', async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transaction/list-transaction`, {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        clientTypeIds: data.clientTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        accountIds: data.accountIds,
        groupTypeIds: data.groupTypeIds,
        accountTypeIds: data.accountTypeIds,
        limit: data.limit
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


export const receiptTransaction = createSlice({
    name: 'transactionMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchReceiptTransactionData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default receiptTransaction.reducer
