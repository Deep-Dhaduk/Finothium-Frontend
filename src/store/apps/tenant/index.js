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

// ** Fetch Tenant
export const fetchTenantData = createAsyncThunk('appTenant/fetchTenantData', async params => {
    const token = getToken()

    const response = await axios.get(`${apiBaseUrl}tenant/list-tenant`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    return response.data
})

// ** Add Tenant
export const addTenant = createAsyncThunk('appTenant/addTenant', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}tenant/create-tenant`, {
        tenantname: data.tenantName, personname: data.personName, address: data.address, contact: data.contactNo, email: data.email, startdate: data.startDate, enddate: data.endDate, status: data.status, createdBy: userData.id, updatedBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    dispatch(fetchTenantData(getState().tenant.params))
    return response.data
})

// ** updateTenant
export const updateTenant = createAsyncThunk('appTenant/updateCompany', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}tenant/update-tenant/${data.id}`, { tenantname: data.tenantName, personname: data.personName, address: data.address, contact: data.contactNo, email: data.email, startdate: data.startDate, enddate: data.endDate, status: data.status, createdBy: userData.id, updatedBy: userData.id },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

        // Dispatch the fetchCompanyData action with the updated parameters
        dispatch(fetchTenantData(getState().company.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete User
export const deleteTenant = createAsyncThunk('appTenant/deleteTenant', async (id, { getState, dispatch }) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}tenant/delete-tenant/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    dispatch(fetchTenantData(getState().tenant.params))

    return response.data
})

export const appTenantSlice = createSlice({
    name: 'appTenant',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTenantData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default appTenantSlice.reducer
