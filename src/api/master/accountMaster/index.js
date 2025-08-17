import authConfig from 'src/configs/auth';

// ** Axios Imports
import axios from 'axios';
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};


// ** Fetch Account
export const fetchAccountData = async params => {
    const token = getToken()
    debugger
    const response = await axios.get(`${apiBaseUrl}account/list-account`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}

// ** Add Account
export const addAccount = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}account/create-account`, {
        account_name: data.accountName,
        group_name_Id: data.accountGroup,
        join_date: data.joinDate,
        exit_date: data.exitDate,
        account_type_Id: data.accountType,
        status: data.status,
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchAccountData(data.params);
    return { success: response.data.success, data: listResponse.data }
}

// ** Update Account
export const updateAccount = async (data, params) => {
    const token = getToken()

    const response = await axios.put(`${apiBaseUrl}account/update-account/${data.id}`, {
        account_name: data.account_name,
        group_name_Id: data.group_name_Id,
        join_date: data.joinDate,
        exit_date: data.exitDate,
        account_type_Id: data.account_type_Id,
        status: data.status,
    },
        {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });

    // Dispatch the fetchAccountData action with the updated parameters
    const listResponse = await fetchAccountData(params);
    return { success: response.data.success, data: listResponse.data }
};

// ** Delete Account
export const deleteAccount = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}account/delete-account/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchAccountData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}
