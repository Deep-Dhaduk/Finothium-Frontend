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

// ** Fetch ChildMenu
export const fetchChildMenuData = createAsyncThunk('appChildMenu/fetchChildMenuData', async params => {
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
})

// ** Add ChildMenu
export const addChildMenu = createAsyncThunk('appChildMenu/addChildMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}childmenu/create-childmenu`, {
         menu_name: data.name, display_rank: data.displayRank, parent_id: data.parentId, status: data.status, createdBy: userData.id, updatedBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    dispatch(fetchChildMenuData(getState().childMenu.params))
    return response.data
})

// ** Update ChildMenu
export const updateChildMenu = createAsyncThunk('appChildMenu/updateChildMenu', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}childmenu/update-childmenu/${data.id}`, {
             menu_name: data.name, display_rank: data.displayRank, parent_id: data.parentId, status: data.status, createdBy: userData.id, updatedBy: userData.id
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        // Dispatch the fetchTransactionData action with the updated parameters
        dispatch(fetchChildMenuData(getState().childMenu.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete ChildMenu
export const deleteChildMenu = createAsyncThunk('appChildMenu/deleteChildMenu', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}childmenu/delete-childmenu/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchChildMenuData(getState().parentMenu.params))
    return response.data
})

export const appChildMenuSlice = createSlice({
    name: 'appChildMenu',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchChildMenuData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.params = action.payload.params
            state.allData = action.payload.allData
            state.total = action.payload.total
        })
    }
})

export default appChildMenuSlice.reducer
