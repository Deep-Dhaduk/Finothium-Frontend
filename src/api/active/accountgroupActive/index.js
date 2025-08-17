import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';

// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};


// ** Fetch Client Data
export const fetchActiveAccountGroupData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}common/active-common`, {
        type: data.type
    },
        {
            // params,
            headers: {
                // 'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        },
    )
    return response.data
}
