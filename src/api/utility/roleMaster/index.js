import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Roles
export const fetchRoleData = async params => {
    const token = getToken()

    const response = await axios.get(`${apiBaseUrl}role/list-role`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// ** Add Roles
export const addRole = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}role/create-role`, {
        rolename: data.roleName, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchRoleData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

// ** Update Roles
export const updateRole = async (data, params) => {
    const token = getToken()

    const response = await axios.put(`${apiBaseUrl}role/update-role/${data.id}`, {
        rolename: data.rolename, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchRoleData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
};

// ** Delete Roles
export const deleteRole = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}role/delete-role/${data.id}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchRoleData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}
