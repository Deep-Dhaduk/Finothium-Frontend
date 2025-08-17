import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

export const loginAsTenant = async (id) => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}tenant/login-tenant/${id}`, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    }
    )
    return { success: response.data.success, data: response.data }
}
