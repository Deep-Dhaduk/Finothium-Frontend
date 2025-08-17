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

// ** Fetch transfer
export const fetchTransferData = createAsyncThunk('transfer/fetchTransferData', async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transfer/list-transfer`, {
        startDate: data.startDate,
        endDate: data.endDate,
        paymentTypeIds: data.paymentIds,
        accountTypeIds: data.accountIds,
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

// ** Add transfer
export const addTransfer = createAsyncThunk('transfer/addTransfer', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}transfer/create-transfer`, {
        transactionDate: data.date,
        paymentType_Id: data.paymentType,
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        amount: data.amount,
        description: data.description,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchTransferData(data.filterData))
    return response.data
})

// ** Update transfer
export const updateTransfer = createAsyncThunk('transfer/updateTransfer', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}transfer/update-transfer/${data.id}`, {
            transactionDate: data.date,
            paymentType_Id: data.paymentType,
            fromAccount: data.fromAccount,
            toAccount: data.toAccount,
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

        // Dispatch the fetchTransferData action with the updated parameters
        dispatch(fetchTransferData(data.filterData));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete transfer
export const deleteTransfer = createAsyncThunk('transfer/deleteTransfer', async (data, { getState, dispatch }) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}transfer/delete-transfer/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchTransferData(data.filterData))
    return response.data
})

export const transferSlice = createSlice({
    name: 'transaction',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTransferData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default transferSlice.reducer
