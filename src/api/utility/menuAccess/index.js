// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Menu Access
export const fetchMenuData = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}menu/list-menu`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}

// ** Add Menu Access
export const addMenu = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}menu/create-menu`, {
        role_id: data.roleId, menuItems: data.permission
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchMenuData();
    return { success: response.data.success, data: listResponse.data }
}
export const resetMenu = async (id) => {
    debugger
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}menu/reset-menu/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchMenuData();
    return { success: response.data.success, data: listResponse.data }
}

