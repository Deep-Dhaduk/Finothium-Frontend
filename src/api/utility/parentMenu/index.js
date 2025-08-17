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

// ** Fetch ParentMenu
export const fetchParentMenuData = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}parentmenu/list-parentmenu`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}

// ** Add ParentMenu
export const addParentMenu = async (data) => {
    const token = getToken()

    const response = await axios.post(`${apiBaseUrl}parentmenu/create-parentmenu`, {
        menu_name: data.name, display_rank: data.displayRank, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchParentMenuData(data.params);
    return { success: response.data.success, data: listResponse.data }
}

// ** Update ParentMenu
export const updateParentMenu = async (data, params) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}parentmenu/update-parentmenu/${data.id}`, {
        menu_name: data.name, display_rank: data.displayRank, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    // Dispatch the fetchTransactionData action with the updated parameters
    const listResponse = await fetchParentMenuData(params);
    return { success: response.data.success, data: listResponse.data }
}

// ** Delete ParentMenu
export const deleteParentMenu = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}parentmenu/delete-parentmenu/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchParentMenuData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

