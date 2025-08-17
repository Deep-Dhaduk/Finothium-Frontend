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
export const fetchTransactionData = createAsyncThunk('transactionMaster/fetchTransactionData', async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transaction/list-transaction`, {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        paymentTypeIds: data.paymentTypeIds,
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

// ** Add Payment Transaction
export const addTransaction = createAsyncThunk('transactionMaster/addTransaction', async (data, { getState, dispatch }) => {
    const token = getToken()

    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}transaction/create-transaction`, {
        transaction_date: data.date,
        transaction_type: data.transactionType,
        payment_type_Id: data.paymentType,
        clientId: data.client_category_Id,
        accountId: data.accountId,
        amount: data.amount,
        description: data.description,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchTransactionData(data.filterData))
    return response.data
})

// ** Update Payment Transaction
export const updateTransaction = createAsyncThunk('transactionMaster/updateTransaction', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}transaction/update-transaction/${data.id}`, {
            transaction_date: data.date,
            transaction_type: data.transactionType,
            payment_type_Id: data.paymentType,
            clientId: data.clientName,
            accountId: data.accountName,
            amount: data.amount,
            description: data.description,
            createdBy: userData.id,
            updatedBy: userData.id
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        // Dispatch the fetchTransactionData action with the updated parameters
        dispatch(fetchTransactionData(data.filterData));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Payment Transaction
export const deleteTransaction = createAsyncThunk('transactionMaster/deleteTransaction', async (data, { getState, dispatch }) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}transaction/delete-transaction/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchTransactionData(data.filterData))
    return response.data
})

export const masterTransactionSlice = createSlice({
    name: 'transactionMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTransactionData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterTransactionSlice.reducer
