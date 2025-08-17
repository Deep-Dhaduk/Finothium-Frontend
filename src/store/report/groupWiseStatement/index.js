import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Payment Transaction
export const filterGroupWiseData = createAsyncThunk('groupWiseStatement/filterGroupWiseData', async data => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}report/filter-groupReport`, {
        startDate: data.startDate,
        endDate: data.endDate,
        groupTypeIds: data.groupTypeIds,
        clientTypeIds: data.clientTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        accountTypeIds: data.accountTypeIds,
        accountIds : data.accountIds
    }, {
        params: data.params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
})


export const groupWiseStatement = createSlice({
    name: 'groupWiseStatement',
    initialState: {
        data: [],
        total: 1,
        params: {},
        allData: []
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(filterGroupWiseData.fulfilled, (state, action) => {
            state.data = action.payload.data
            state.total = action.payload.total
            state.params = action.payload.params
            state.allData = action.payload.allData
        })
    }
})

export default groupWiseStatement.reducer
