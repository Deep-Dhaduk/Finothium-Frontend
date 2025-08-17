import axios from "axios";
import authConfig from 'src/configs/auth';
import { apiBaseUrl } from "src/varibles/variable";

const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};


export const fetchTransferData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transfer/list-transfer`, {
        startDate: data.startDate,
        endDate: data.endDate,
        paymentTypeIds: data.paymentTypeIds,
        accountTypeIds: data.accountIds,
        limit: data.limit,
        fromAmount: data.fromAmt,
        toAmount: data.toAmt,
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
}

export const addTransaction = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transfer/create-transfer`, {
        transactionDate: data.date,
        paymentType_Id: data.paymentType,
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        amount: data.amount,
        description: data.description,
        details: data.details

    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchTransferData(data.filterData);
    return { success: response.data.success, data: listResponse.data }
}

// ** Update Payment Transaction
export const updateTransaction = async (data) => {
    const token = getToken()

    const response = await axios.put(`${apiBaseUrl}transfer/update-transfer/${data.id}`, {
        transactionDate: data.date,
        paymentType_Id: data.paymentType,
        fromAccount: data.fromAccount,
        toAccount: data.toAccount,
        amount: data.amount,
        description: data.description,
        details: data.details
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchTransferData(data.filterData);
    return { success: response.data.success, data: listResponse.data }
}


// ** Delete Payment Transaction
export const deleteTransaction = async (data) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}transfer/delete-transfer/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchTransferData(data.filterData);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}