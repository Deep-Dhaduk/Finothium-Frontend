// ** Redux Imports
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

// ** Fetch Menu Access
export const fetchRoleWisePermission = createAsyncThunk('appRoleWisePermissions/fetchMenuData', async (id) => {
  const token = getToken()
  const response = await axios.get(`${apiBaseUrl}menu/list-menurole/${id}`, {
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  },
  )
  return response.data
})


export const appRoleWisePermissionsSlice = createSlice({
  name: 'appRoleWisePermissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchRoleWisePermission.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appRoleWisePermissionsSlice.reducer
