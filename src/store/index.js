// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import permissions from 'src/store/apps/permissions'
import roleWisePermission from 'src/store/apps/roleWisePermission'
import parentMenu from 'src/store/apps/parentMenu'
import company from 'src/store/master/company'
import common from 'src/store/master/common'
import transaction from 'src/store/transaction/transaction'
import receiptTransaction from 'src/store/transaction/receiptTransaction'
import dashboard from 'src/store/dashboard'
import dashboardGroupData from 'src/store/dashboardGroupData'
import transfer from 'src/store/transaction/transfer'
import childMenu from 'src/store/apps/childMenu'
import tenant from 'src/store/apps/tenant'
import client from 'src/store/master/client'
import category from 'src/store/master/category'
import role from 'src/store/apps/role'
import singleUser from 'src/store/apps/single-user'
import account from 'src/store/master/account'
import accountActive from 'src/store/active/accountActive'
import childActive from 'src/store/active/childActive'
import clientActive from 'src/store/active/clientActive'
import commonActive from 'src/store/active/commonActive'
import companyActive from 'src/store/active/companyActive'
import parentActive from 'src/store/active/parentActive'
import roleActive from 'src/store/active/roleActive'
import tenantActive from 'src/store/active/tenantActive'
import userActive from 'src/store/active/userActive'
import accountGroupActive from 'src/store/active/accountGroupActive'
import accountGroup from 'src/store/master/accountGroup'
import accountType from 'src/store/master/accountType'
import paymentWiseStatement from 'src/store/report/paymentWiseStatement'
import accountTypeWiseStatement from 'src/store/report/accountTypeWiseStatement'
import clientWiseStatement from 'src/store/report/clientWiseStatement'
import categoryWiseStatement from 'src/store/report/CategoryWiseStatement'
import accountWiseStatement from 'src/store/report/accountWiseStatement'
import groupWiseStatement from 'src/store/report/groupWiseStatement'
import companyWiseStatement from 'src/store/report/companyWiseStatement'

export const store = configureStore({
  reducer: {
    user,
    singleUser,
    dashboard,
    dashboardGroupData,
    accountGroup,
    accountType,
    role,
    account,
    client,
    category,
    tenant,
    permissions,
    roleWisePermission,
    receiptTransaction,
    company,
    common,
    transaction,
    transfer,
    parentMenu,
    childMenu,
    paymentWiseStatement,
    clientWiseStatement,
    categoryWiseStatement,
    accountWiseStatement,
    companyWiseStatement,
    groupWiseStatement,
    accountTypeWiseStatement,
    accountActive,
    childActive,
    clientActive,
    commonActive,
    companyActive,
    parentActive,
    roleActive,
    tenantActive,
    userActive,
    accountGroupActive

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
