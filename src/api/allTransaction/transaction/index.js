import axios from "axios";
import authConfig from 'src/configs/auth';
import { apiBaseUrl } from "src/varibles/variable";

const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

export const fetchTransaction = async (data) => {
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
    const response = await axios.post(`${apiBaseUrl}transaction/create-transaction`, {
        transaction_date: data.date,
        transaction_type: data.transactionType,
        payment_type_Id: data.paymentType,
        clientId: data.clientName,
        accountId: data.accountName,
        amount: data.amount,
        description: data.description,
        details: data.details,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchTransaction(data.filterData);
    return { success: response.data.success, data: listResponse.data }
}

// ** Update Payment Transaction
export const updateTransaction = async (data) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}transaction/update-transaction/${data.id}`, {
        transaction_date: data.date,
        transaction_type: data.transactionType,
        payment_type_Id: data.paymentType,
        clientId: data.clientName,
        accountId: data.accountName,
        amount: data.amount,
        description: data.description,
        details: data.details
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    // Dispatch the fetchTransactionData action with the updated parameters

    const listResponse = await fetchTransaction(data.filterData);
    return { success: response.data.success, data: listResponse.data };
}

// ** Delete Payment Transaction
export const deleteTransaction = async (data) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}transaction/delete-transaction/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchTransaction(data.filterData);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}