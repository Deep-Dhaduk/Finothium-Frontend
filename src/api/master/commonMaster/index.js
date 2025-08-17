import authConfig from 'src/configs/auth';

// ** Axios Imports
import axios from 'axios';
import { apiBaseUrl } from 'src/varibles/variable';

// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Client Data
export const fetchCommonData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}common/list-common`, {
        type: data.type
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

// ** Add Client Data
export const addCommonMenu = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}common/create-common`, {
        name: data.name, type: data.type, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchCommonData({ type: data.type, params: data.params });
    return { success: response.data.success, data: listResponse.data }
}

// ** Update Client Data
export const updateCommonMenu = async (data, params) => {
    const token = getToken()

    const response = await axios.put(`${apiBaseUrl}common/update-common/${data.id}`, {
        name: data.name, type: data.type, status: data.status
    },
        {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });

    // Dispatch the fetchCommonData action with the updated parameters
    const listResponse = await fetchCommonData({ type: data.type, params });
    return { success: response.data.success, data: listResponse.data }
};

// ** Delete Client Data
export const deleteCommon = async (data) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}common/delete-common/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchCommonData({ type: data.type, params: data.params });
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}
