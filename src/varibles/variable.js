import { createContext } from "react"
import { userMaster } from 'src/varibles/constant'


export const pageSizeLength = [10, 25, 50, 100]
export const defaultPageSize = 10
export const defaultDashboardDataLimit = 10
export const defaultRowMessage = "There is no data available for display."
export const defaultFooterMessage = `Note: To view a newly added company here, visit the ${userMaster} and assign it to the logged-in user.`
export const defaultDateRange = 10
export const defaultReport = 'summary_and_detail'
export const dividerBgDark = '#6B6C89'
export const dividerBgLight = '#C9C9D4'
export const AppContext = createContext()
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
export const mainDarkLogo = '/images/logos/logo-dark.png'
export const mainLightLogo = '/images/logos/logo-light.png'
export const loaderDarkLogo = '/images/logos/loading-dark-logo.png'
export const loaderLightLogo = '/images/logos/loading-light-logo.png'

export const advanceFilter = {
    showFromDate: false,
    showToDate: false,
    showAccountGroupName: false,
    showAccountName: false,
    showAccountTypeName: false,
    showPaymentTypeName: false,
    showClientName: false,
    showCategoryName: false,
    showFromAmount: false,
    showToAmount: false,
    showSubCategory: false
}

export const defaultFilterData = {
    startDate: new Date(),
    endDate: new Date(),
    accountIds: [],
    groupTypeIds: [],
    paymentTypeIds: [],
    categoryTypeIds: [],
    clientTypeIds: [],
    accountTypeIds: [],
    subCategoryIds: [],
    fromAmt: null,
    toAmt: null
}
