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


// ** Fetch Payment Transaction
export const filterPaymentWiseData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}report/filter-paymentReport`, {
        startDate: data.startDate,
        endDate: data.endDate,
        groupTypeIds: data.groupTypeIds,
        clientTypeIds: data.clientTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        accountTypeIds: data.accountTypeIds,
        accountIds: data.accountIds,
        fromAmount: data.fromAmt,
        toAmount: data.toAmt
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
}



