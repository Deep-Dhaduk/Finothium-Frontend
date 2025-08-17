import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Get User Data
const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}

// ** Fetch Company
export const fetchCompanyData = createAsyncThunk('companyMaster/fetchCompanyData', async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}company/list-company`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    return response.data
})

// ** Add Company
export const addCompany = createAsyncThunk('companyMaster/addCompany', async ({ companyName, legalName, authorizePersonName, address, contactNo, email, website, PAN, GSTIN, status }, { getState, dispatch }) => {
    const token = getToken()
    const data = getUserData()
    const response = await axios.post(`${apiBaseUrl}company/create-company`, {
        company_name: companyName,
        legal_name: legalName,
        authorize_person_name: authorizePersonName,
        address: address,
        contact_no: contactNo,
        email: email,
        website: website,
        pan: PAN,
        gstin: GSTIN,
        status: status,
        createdBy: data.id,
        updatedBy: data.id
    }, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    // const json = await response.json()
    // setCompany(company.concat(json))
    dispatch(fetchCompanyData(getState().company.params))
    return response.data
})

// ** Update Company
export const updateCompany = createAsyncThunk('companyMaster/updateCompany', async (data, { getState, dispatch }) => {
    const token = getToken()
    const userData = getUserData()
    try {
        const response = await axios.put(`${apiBaseUrl}company/update-company/${data.id}`, {
            company_name: data.companyName,
            legal_name: data.legalName,
            authorize_person_name: data.authorizePersonName,
            address: data.address,
            contact_no: data.contactNo,
            email: data.email,
            website: data.website,
            pan: data.PAN,
            gstin: data.GSTIN,
            status: data.status,
            createdBy: userData.id,
            updatedBy: userData.id
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            });

        // Dispatch the fetchCompanyData action with the updated parameters
        dispatch(fetchCompanyData(getState().company.params));
        return response.data;
    } catch (error) {
        // Handle errors here
        console.error('Error updating company:', error);
        throw error; // Re-throw the error to propagate it to the component
    }
}
);

// ** Delete Company
export const deleteCompany = createAsyncThunk('companyMaster/deleteCompany', async (id, { getState, dispatch }) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}company/delete-company/${id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
    )
    dispatch(fetchCompanyData(getState().company.params))
    return response.data
})

export const masterCompanySlice = createSlice({
    name: 'companyMaster',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchCompanyData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default masterCompanySlice.reducer
