// ** Redux Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authConfig from 'src/configs/auth';

// ** Axios Imports
import axios from 'axios';
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
export const fetchMenuData = createAsyncThunk('appPermissions/fetchMenuData', async (params) => {
  const token = getToken()

  const response = await axios.get(`${apiBaseUrl}menu/list-menu`, {
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  },
  )
  return response.data
})


// ** Add Menu Access
export const addMenu = createAsyncThunk('appPermissions/addMenu', async (data, { getState, dispatch }) => {
  const token = getToken()
  const userData = getUserData()
  const response = await axios.post(`${apiBaseUrl}menu/create-menu`, {
    role_id: data.roleId, menuItems: data.permission
  }, {
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  }
  )
  dispatch(fetchMenuData(getState().permissions.params))
  return response.data
})

export const updateMenu = createAsyncThunk('appPermissions/updateMenu', async (data, { getState, dispatch }) => {
  const token = getToken()
  const userData = getUserData()
  const response = await axios.post(`${apiBaseUrl}menu/update-menu/${data.id}`, {
    role_id: data.roleId, menuItems: data.permission, updateBy: userData.id
  }, {
    headers: {
      // 'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    }
  }
  )
  dispatch(fetchMenuData(getState().permissions.params))
  return response.data
})

// ** Delete ParentMenu
export const resetMenu = createAsyncThunk('appPermissions/deleteParentMenu', async (id, { getState, dispatch }) => {
  const token = getToken()

  const response = await axios.delete(`${apiBaseUrl}menu/reset-menu/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    })
  return response.data
})

export const appPermissionsSlice = createSlice({
  name: 'appPermissions',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMenuData.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.total = action.payload.total
    })
  }
})

export default appPermissionsSlice.reducer
