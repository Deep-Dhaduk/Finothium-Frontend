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

export const fetchOneUserData = createAsyncThunk('appUsers/fetchOneUserData', async (id, { getState }) => {
  const token = getToken()
  const response = await axios.get(`${apiBaseUrl}user/list-user/${id}`, {
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  })
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
    builder.addCase(fetchOneUserData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
