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

// ** Fetch ChildMenu
export const fetchChildMenuData = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}childmenu/list-childmenu`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}

// ** Add ChildMenu
export const addChildMenu = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}childmenu/create-childmenu`, {
        menu_name: data.name, display_rank: data.displayRank, parent_id: data.parentId, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchChildMenuData(data.params);
    return { success: response.data.success, data: listResponse.data }
}

// ** Update ChildMenu
export const updateChildMenu = async (data, params) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}childmenu/update-childmenu/${data.id}`, {
        menu_name: data.name, display_rank: data.displayRank, parent_id: data.parentId, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    // Dispatch the fetchTransactionData action with the updated parameters
    const listResponse = await fetchChildMenuData(params);
    return { success: response.data.success, data: listResponse.data }
};

// ** Delete ChildMenu
export const deleteChildMenu = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}childmenu/delete-childmenu/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchChildMenuData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}


