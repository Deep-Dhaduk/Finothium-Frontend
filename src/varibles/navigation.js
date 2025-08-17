export const adminNavigation = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: 'mdi:view-dashboard'
  },
  {
    title: 'Master',
    icon: 'mdi:file-document-outline',
    children: [
      {
        title: 'Company Master',
        path: '/master/company-master'
      },
      {
        title: 'Client Master',
        path: '/master/client-master'
      },
      {
        title: 'Category Master',
        path: '/master/category-master'
      },
      {
        title: 'Sub Category Master',
        path: '/master/subcategory-master'
      },
      {
        title: 'Payment Type Master',
        path: '/master/payment-type-master'
      },
      {
        title: 'Account Type Master',
        path: '/master/account-type-master'
      },
      {
        title: 'Account Group Master',
        path: '/master/account-group-master'
      },
      {
        title: 'Account Master',
        path: '/master/account-master'
      },

    ]
  },
  {
    title: 'Transaction',
    icon: 'mdi:bank-transfer',
    children: [
      {
        title: 'Receipt',
        path: '/transaction/receipt-transaction'
      },
      {
        title: 'Payment',
        path: '/transaction/payment-transaction'
      },
      {
        title: 'Transfer',
        path: '/transaction/transfer'
      },
    ]
  },
  {
    title: 'Report',
    icon: 'mdi:poll',
    children: [
      {
        title: 'Company Statement',
        path: '/report/company-wise-statement',
      },
      {
        title: 'Account Group Statement',
        path: '/report/group-wise-statement',
      },
      {
        title: 'Account Statement',
        path: '/report/account-wise-statement',
      },
      {
        title: 'Account Type Statement',
        path: '/report/account-type-wise-statement',
      },
      {
        title: 'Payment Type Statement',
        path: '/report/payment-wise-statement',
      },
      {
        title: 'Client Statement',
        path: '/report/client-wise-statement',
      },
      {
        title: 'Category Statement',
        path: '/report/category-wise-statement',
      },
      {
        title: 'Monthly Statement',
        path: '/report/monthly-statement',
      },

      {
        title: 'Semi Annual Statement',
        path: '/report/semi-annual-statement',
      },
      {
        title: 'Annually Statement',
        path: '/report/annually-statement',
      },
      {
        title: 'Quarterly Statement',
        path: '/report/quarterly-statement',
      },
      {
        title: 'Sub Category Statement',
        path: '/report/subcategory-statement',
      },
    ]
  },
  {
    title: 'Utility',
    icon: 'mdi:lock-outline',
    children: [
      {
        title: 'User Master',
        path: '/apps/utility/user/list'
      },
      {
        title: 'Tenant Master',
        path: '/apps/utility/tenant'
      },
      {
        title: 'Role Master',
        path: '/apps/utility/roles'
      },
      {
        title: 'Parent Menu',
        path: '/apps/utility/parent-menu'
      },
      {
        title: 'Child Menu',
        path: '/apps/utility/child-menu'
      },
      {
        title: 'Menu Access',
        path: '/apps/utility/permissions'
      },
    ]
  },
]

const additionalMenu = [
  {
    title: 'Dashboard',
    path: '/dashboard'
  },
  {
    title: 'Login',
    path: '/login'
  },
  {
    title: 'Setting',
    path: '/settings'
  }
]

export const navAllChildren = adminNavigation.flatMap(item => item.children || []).concat(additionalMenu)