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

// ** Fetch Roles
export const fetchRoleData = createAsyncThunk('roles/fetchRoleData', async params => {
    const token = getToken()

    const response = await axios.get(`${apiBaseUrl}role/list-role`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    return response.data
})

// ** Add Roles
export const addRole = createAsyncThunk('roles/addRole', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}role/create-role`, {
        rolename: data.roleName, status: data.status
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    dispatch(fetchRoleData(getState().role.params))
    return response.data
})

// ** Update Roles
export const updateRole = createAsyncThunk('roles/updateRole', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}role/update-role/${data.id}`, {
            rolename: data.rolename, status: data.status, createdBy: userData.id, updatedBy: userData.id
        }, {
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
        dispatch(fetchRoleData(getState().role.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Roles
export const deleteRole = createAsyncThunk('roles/deleteRole', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}role/delete-role/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    dispatch(fetchRoleData(getState().role.params))

    return response.data
})

export const rolesSlice = createSlice({
    name: 'roles',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: [],
        msg: '',
        success: true
    },
    reducers: {},
    extraReducers: builder => {

        builder.addCase(fetchRoleData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
            state.msg = action.payload.message
            state.success = action.payload.success
        })

    }
})

export default rolesSlice.reducer
