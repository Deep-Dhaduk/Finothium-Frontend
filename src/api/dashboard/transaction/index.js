import { apiBaseUrl } from "src/varibles/variable";
import authConfig from 'src/configs/auth'
import axios from "axios";

const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}

export const fetchDashboardTransaction = async (data) => {
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
}