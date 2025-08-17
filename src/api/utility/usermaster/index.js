import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

const getUserData = () => {
    return JSON.parse(localStorage.getItem(authConfig.storageDataKeyName))

}


// ** Fetch Users
export const fetchUserData = async params => {
    const token = getToken()
    const response = await axios.get(`${apiBaseUrl}user/list-user`, {
        params,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    return response.data
}

// ** Add User
export const addUser = async (data) => {
    const token = getToken()
    const userData = getUserData()
    const response = await axios.post(`${apiBaseUrl}user/create-user`, {
        username: data.userName,
        fullname: data.fullName,
        profile_image: data.profile_image,
        password: data.password,
        email: data.email,
        companies: data.company,
        roleId: data.role,
        status: data.status,
        createdBy: userData.id,
        updatedBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })
    const listResponse = await fetchUserData(data.params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}
// ** Update User
export const updateUser = async (data, params) => {
    const token = getToken()
    const userData = getUserData()

    const response = await axios.put(`${apiBaseUrl}user/update-user/${data.id}`, {
        username: data.userName,
        fullname: data.fullName,
        profile_image: data.profile_image,
        email: data.email,
        companyId: data.company,
        roleId: data.role,
        status: data.status,
        createdBy: userData.id,
        updatedBy: userData.id
    }, {
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    // Dispatch the fetchTransactionData action with the updated parameters
    const listResponse = await fetchUserData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
};

// ** Delete User
export const deleteUser = async (data) => {
    const token = getToken()
    const response = await axios.delete(`${apiBaseUrl}user/delete-user/${data.id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })
    const listResponse = await fetchUserData(data.params);
    return { success: response.data.success, data: listResponse.data }
}

// ** Change password
export const changeCompany = async (id) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}user/change-company`, {
        companyId: id
    },
        {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
    // dispatch(fetchUserData(getState().user.params))
    return response.data
}

// ** Forget password
export const forgetPassword = async (data) => {
    const response = await axios.post(`${apiBaseUrl}user/forget-password`, {
        email: data.email
    },)
    // dispatch(fetchUserData(getState().user.params))
    return response.data
}

// ** Change User Password
export const changePassword = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}user/change-password/${data.id}`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
    }, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    await fetchUserData();
    return response.data
}

// ** Change User Password
export const resetPassword = async (data, params) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}user/reset-password/${data.id}`, {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
    },
        {
            headers: {
                'authorization': `Bearer ${token}`
            },
        }
    )
    const listResponse = await fetchUserData(params);
    return { success: response.data.success, message: response.data.message, data: listResponse.data }
}

