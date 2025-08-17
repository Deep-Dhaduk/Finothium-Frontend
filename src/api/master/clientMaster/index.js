import authConfig from 'src/configs/auth';


// ** Axios Imports
import axios from 'axios';
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Client Data
export const fetchClientData = async (data) => {
    const token = getToken()
    debugger
    const response = await axios.post(`${apiBaseUrl}client/list-client`, {
        type: data.type,
    }, {
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
export const addClient = async (data, type) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}client/create-client`, {
        clientName: data.name,
        status: data.status,
        type: data.type
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchClientData({ type, params: data.params });
    return { success: response.data.success, data: listResponse.data }
}

// ** Update Client Data
export const updateClient = async (data, type, params) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}client/update-client/${data.id}`, {
        clientName: data.name,
        type: data.type,
        status: data.status,
    },
        {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });

    // Dispatch the fetchClientData action with the updated parameters
    const listResponse = await fetchClientData({ type, params });
    return { success: response.data.success, data: listResponse.data }
};

// ** Delete Client Data
export const deleteClient = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}client/delete-client/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchClientData({ type: data.type, params: data.params });
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}
