import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';

// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Tenant
export const fetchTenantData = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}tenant/list-tenant`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// ** Add Tenant
export const addTenant = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}tenant/create-tenant`, {
        tenantname: data.tenantName, personname: data.personName, address: data.address, contact: data.contactNo, email: data.email, startdate: data.startDate, enddate: data.endDate, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchTenantData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

// ** updateTenant
export const updateTenant = async (data, params) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}tenant/update-tenant/${data.id}`, {
        tenantname: data.tenantName,
        personname: data.personName,
        address: data.address,
        contact: data.contactNo,
        email: data.email,
        startdate: data.startDate,
        enddate: data.endDate,
        status: data.status
    },
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });

    // Dispatch the fetchCompanyData action with the updated parameters
    const listResponse = await fetchTenantData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
};

// ** Delete User
export const deleteTenant = async (data) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}tenant/delete-tenant/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchTenantData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

