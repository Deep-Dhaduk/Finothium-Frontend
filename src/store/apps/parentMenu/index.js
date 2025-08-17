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

// ** Get User Data
const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}

// ** Fetch ParentMenu
export const fetchParentMenuData = createAsyncThunk('appParentMenu/fetchParentMenuData', async params => {
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
})

// ** Add ParentMenu
export const addParentMenu = createAsyncThunk('appParentMenu/addParentMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}parentmenu/create-parentmenu`, {
         menu_name: data.name, display_rank: data.displayRank, status: data.status, createdBy: userData.id, updatedBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchParentMenuData(getState().parentMenu.params))
    return response.data
})

// ** Update ParentMenu
export const updateParentMenu = createAsyncThunk('appParentMenu/updateParentMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}parentmenu/update-parentmenu/${data.id}`, {
             menu_name: data.name, display_rank: data.displayRank, status: data.status, createdBy: userData.id, updatedBy: userData.id
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        // Dispatch the fetchTransactionData action with the updated parameters
        dispatch(fetchParentMenuData(getState().parentMenu.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete ParentMenu
export const deleteParentMenu = createAsyncThunk('appParentMenu/deleteParentMenu', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}parentmenu/delete-parentmenu/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchParentMenuData(getState().parentMenu.params))
    return response.data
})

export const appParentMenuSlice = createSlice({
    name: 'appParentMenu',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchParentMenuData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.params = action.payload.params
            state.allData = action.payload.allData
            state.total = action.payload.total
        })
    }
})

export default appParentMenuSlice.reducer
