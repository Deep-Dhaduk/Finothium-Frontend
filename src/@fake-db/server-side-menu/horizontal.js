import { homeIcon } from "src/varibles/icons"

const navigation = () => {
  return [
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: 'mdi:home-outline',
    },
    {
      title: 'Master',
      icon: 'mdi:file-document-outline',

      children: [
        {
          title: 'Company Master',
          path: '/master/company/'
        },
        {
          title: 'Client Master',
          path: '/master/client/'
        },
        {
          title: 'Category Master',
          path: '/master/category/'
        },
        {
          title: 'Payment Type Master',
          path: '/master/payment-type/'
        },
        {
          title: 'Account Type Master',
          path: '/master/account-type/'
        },
        {
          title: 'Account Group Master',
          path: '/master/account-group/'
        },
        {
          title: 'Account Master',
          path: '/master/account/'
        },
      ]
    },
    {
      title: 'Transaction',
      icon: 'mdi:bank-transfer',
      children: [
        {
          title: 'Payment Transaction',
          path: '/transaction/payment-transaction'
        },
        {
          title: 'Receipt Transaction',
          path: '/transaction/receipt-transaction'
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
          title: 'Company wise Statement',
          path: '/report/company-report',
        },
        {
          title: 'Group wise Statement',
          path: '/report/group-report',
        },
        {
          title: 'Account wise Statement',
          path: '/report/account-report',
        },
        {
          title: 'Payment wise Statement',
          path: '/report/payment-report',
        },
        {
          title: 'Client wise Statement',
          path: '/report/client-report',
        },
        {
          title: 'Category wise Statement',
          path: '/report/category-report',
        },
        {
          title: 'Monthly Statement',
          path: '/report/monthly-statement',
        },
        {
          title: 'Quarterly Statement',
          path: '/report/quarterly-statement',
        },
        {
          title: 'Semi Annual Statement',
          path: '/report/semi-annual-statement',
        },
        {
          title: 'Annually Statement',
          path: '/report/annually-statement',
        }
      ]
    },
    {
      title: 'Utility',
      icon: 'mdi:lock-outline',
      children: [
        {
          title: 'User Master',
          path: '/apps/utility/user/list/'
        },
        {
          title: 'Tenant Master',
          path: '/apps/utility/tenant/'
        },
        {
          title: 'Role Master',
          path: '/apps/utility/roles/'
        },
        {
          title: 'Parent Menu',
          path: '/apps/utility/parentMenu/'
        },
        {
          title: 'Child Menu',
          path: '/apps/utility/childMenu/'
        },
        {
          title: 'Menu Access',
          path: '/apps/utility/permissions/'
        },
      ]
    },
  ]
}

export default navigation
