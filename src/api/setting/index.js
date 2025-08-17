import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Get User Data
const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName));
}


// ** Fetch Account
export const fetchCompanySetting = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}companysetting/list-companysetting`, {
        params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}


export const updateCompanySetting = async (data) => {
    const token = getToken()
    const response = await axios.put(`${apiBaseUrl}companysetting/update-companysetting`, {
        fiscalStartMonth: data.fiscal_start_month,
        defaultDateOption: data.default_date_option
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    const listResponse = await fetchCompanySetting();
    return { success: response.data.success, data: listResponse.data }
}


