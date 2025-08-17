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
export const fetchGroupData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}dashboard/dashboard-group-data`,
        {
            startDate: data.startDate,
            endDate: data.endDate
        },
        {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        },
    )
    return response.data
}

export const fetchDashboard = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}dashboard/dashboard-data`,
        {
            startDate: data.startDate,
            endDate: data.endDate
        },
        {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        },
    )
    return response.data
}

