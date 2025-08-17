import authConfig from 'src/configs/auth'

// ** Axios Imports
import axios from 'axios'
import { apiBaseUrl } from 'src/varibles/variable';


// ** Get token
const getToken = () => {
    return localStorage.getItem(authConfig.storageTokenKeyName);
};

// ** Fetch Payment Transaction
export const filterSubCategoryWiseData = async (data) => {
    const token = getToken()
    const response = await axios.post(`${apiBaseUrl}transactiondetails/filter-subCategoryReport`, {
        startDate: data.startDate,
        endDate: data.endDate,
        groupTypeIds: data.groupTypeIds,
        clientTypeIds: data.clientTypeIds,
        paymentTypeIds: data.paymentTypeIds,
        categoryTypeIds: data.categoryTypeIds,
        accountTypeIds: data.accountTypeIds,
        subcategoryTypeIds: data.subCategoryIds,
        accountIds: data.accountIds,
        fromAmount: data.fromAmt,
        toAmount: data.toAmt,
    }, {
        params: data.params,
        headers: {
            // 'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    },
    )
    return response.data
}

