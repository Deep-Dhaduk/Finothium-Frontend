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

export const fetchPaymentWiseData = createAsyncThunk('paymentWiseStatement/fetchPaymentWiseData', async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}report/list-payment`,
        {
            startDate: data.startDate,
            endDate: data.endDate,
            groupTypeIds: data.groupTypeIds,
            clientTypeIds: data.clientTypeIds,
            paymentTypeIds: data.paymentTypeIds,
            categoryTypeIds: data.categoryTypeIds,
            accountTypeIds: data.accountTypeIds,
            accountIds : data.accountIds
        },
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

// ** Fetch Payment Transaction
export const filterPaymentWiseData = createAsyncThunk('paymentWiseStatement/filterPaymentWiseData', async (data, { getState, dispatch }) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}report/filter-paymentReport`, {
        startDate: data.startDate,
        endDate: data.endDate,
        groupTypeIds: data.groupTypeIds,
        clientTypeIds: data.clientTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        accountTypeIds: data.accountTypeIds
    },
        {
            params: data.params,
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        },
    )
    // dispatch(fetchPaymentWiseData(getState().paymentTransaction.params))
    return response.data
})

// ** Add Payment Transaction
export const addTransaction = createAsyncThunk('transactionMaster/addTransaction', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}transaction/create-transaction`, {
        transaction_date: data.date, transaction_type: data.transactionType, payment_type_Id: data.paymentType, client_category_name_Id: data.client_category_name, accountId: data.accountId, amount: data.amount, description: data.description, createdBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchPaymentWiseData(getState().paymentTransaction.params))
    return response.data
})

// ** Update Payment Transaction
export const updateTransaction = createAsyncThunk('transactionMaster/updateTransaction', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}transaction/update-transaction/${data.id}`, {
            transaction_date: data.date, transaction_type: data.transactionType, payment_type: data.paymentType, client_category_name: data.clientName, accountId: data.accountName, amount: data.amount, description: data.description, updatedBy: userData.id
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        // Dispatch the fetchPaymentWiseData action with the updated parameters
        dispatch(fetchPaymentWiseData(getState().paymentTransaction.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Payment Transaction
export const deleteTransaction = createAsyncThunk('transactionMaster/deleteTransaction', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}transaction/delete-transaction/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchPaymentWiseData(getState().paymentTransaction.params))
    return response.data
})

export const paymentWiseStatement = createSlice({
    name: 'paymentWiseStatement',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(filterPaymentWiseData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default paymentWiseStatement.reducer
