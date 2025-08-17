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

// ** Fetch Users
export const fetchUserData = createAsyncThunk('appUsers/fetchUserData', async params => {
  const token = getToken()
  const response = await axios.get(`${apiBaseUrl}user/list-user`, {
    params,
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
  return response.data
})

// ** Add User
export const addUser = createAsyncThunk('appUsers/addUser', async (data, { getState, dispatch }) => {
  const token = getToken()
  const userData = getUserData()
  const response = await axios.post(`${apiBaseUrl}user/create-user`, {
    username: data.userName,
    fullname: data.fullName,
    profile_image: data.profile_image,
    password: data.password,
    confirmpassword: data.confirmPassword,
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
  dispatch(fetchUserData(getState().user.params))
  return response.data
})
// ** Update User
export const updateUser = createAsyncThunk('appUsers/updateUser', async (data, { getState, dispatch }) => {
  const token = getToken()
  const userData = getUserData()
  try {
    const response = await axios.put(`${apiBaseUrl}user/update-user/${data.id}`, {
      username: data.userName,
      fullname: data.fullName,
      profile_image: data.profile_image,
      email: data.email,
      password: data.password,
      confirmpassword: data.confirmpassword,
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
    dispatch(fetchUserData(getState().user.params));
    return response.data;
  } catch (error) {
    // Handle errors here
    console.error('Error updating company:', error);
    throw error; // Re-throw the error to propagate it to the component
  }
}
);

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { getState, dispatch }) => {
  const token = getToken()
  const response = await axios.delete(`${apiBaseUrl}user/delete-user/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
  dispatch(fetchUserData(getState().user.params))

  return response.data
})

// ** Change password
export const changeCompany = createAsyncThunk('appUsers/changeCompany', async (id, { getState, dispatch }) => {
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
})

// ** Forget password
export const forgetPassword = createAsyncThunk('appUsers/forgetPassword', async (data, { getState, dispatch }) => {
  const response = await axios.post(`${apiBaseUrl}user/forget-password`, {
    email: data.email
  },)
  // dispatch(fetchUserData(getState().user.params))
  return response.data
})

// ** Change User Password
export const changePassword = createAsyncThunk('appUsers/changePassword', async (data, { getState, dispatch }) => {
  const response = await axios.post(`${apiBaseUrl}user/change-password/${data.id}`, {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  })
  dispatch(fetchUserData(getState().user.params));
  return response.data
})

// ** Change User Password
export const resetPassword = createAsyncThunk('appUsers/resetPassword', async (data, { getState, dispatch }) => {
  const response = await axios.post(`${apiBaseUrl}user/reset-password/${data.id}`, {
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword
  })
  dispatch(fetchUserData(getState().user.params));
  return response.data
})

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.singledata = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
