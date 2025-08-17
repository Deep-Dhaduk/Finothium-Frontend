
// ** Axios Imports
import axios from 'axios';
import authConfig from 'src/configs/auth';
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Company
export const fetchCompanyData = async params => {
    const token = getToken()
    debugger
    const response = await axios.get(`${apiBaseUrl}company/list-company`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    return response.data
}

// ** Add Company
export const addCompany = async (data, params) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}company/create-company`, {
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
    }, {
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    // const json = await response.json()
    // setCompany(company.concat(json))
    const listResponse = await fetchCompanyData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

// ** Update Company
export const updateCompany = async (data, params) => {
    const token = getToken()

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
    },
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });

    // Dispatch the fetchCompanyData action with the updated parameters
    const listResponse = await fetchCompanyData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

// ** Delete Company
export const deleteCompany = async (data) => {
    const token = getToken()

    const response = await axios.delete(`${apiBaseUrl}company/delete-company/${dataid}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
    )
    const listResponse = await fetchCompanyData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}