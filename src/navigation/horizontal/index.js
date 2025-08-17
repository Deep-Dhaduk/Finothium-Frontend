import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "src/hooks/useAuth"
import { fetchMenuData } from "src/store/apps/permissions"
import { adminRoleName, superAdminRoleName } from "src/varibles/constant"

const navigation = () => {
  const user = JSON.parse(localStorage.getItem('userData'))
  const store = useSelector(store => store.permissions)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchMenuData())
  }, [])

  const adminNavigation = [
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: 'mdi:home-outline'
    },
    {
      title: 'Master',
      icon: 'mdi:file-document-outline',

      children: [
        {
          title: 'Company Master',
          path: '/master/company-master/'
        },
        {
          title: 'Client Master',
          path: '/master/client-master/'
        },
        {
          title: 'Category Master',
          path: '/master/category-master/'
        },
        {
          title: 'Payment Type Master',
          path: '/master/payment-type-master/'
        },
        {
          title: 'Account Type Master',
          path: '/master/account-type-master/'
        },
        {
          title: 'Account Group Master',
          path: '/master/account-group-master/'
        },
        {
          title: 'Account Master',
          path: '/master/account-master/'
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
          path: '/apps/utility/parent-menu/'
        },
        {
          title: 'Child Menu',
          path: '/apps/utility/child-menu/'
        },
        {
          title: 'Menu Access',
          path: '/apps/utility/permissions/'
        },
      ]
    },
  ]

  const userNavigation = () => {
    const updatedNavigation = store.data
      .filter(item => item.allow_access === 1)
      .map(item => ({
        title: item.child_menu_name,
        path: item.parent_menu_name
          ? `/${item.parent_menu_name.toLowerCase()}/${item.child_menu_name.toLowerCase().replace(/\s+/g, '-')}`
          : `/${item.child_menu_name.toLowerCase().replace(/\s+/g, '-')}`,
        allow_access: item.allow_access === 1,
        parent: item.parent_menu_name,
        action: 'read',
        subject: 'all',
      }));

    const organizedNavigation = updatedNavigation.reduce((acc, item) => {
      if (!acc[item.parent]) {
        acc[item.parent] = [];
      }
      acc[item.parent].push(item);
      return acc;
    }, {});

    const finalNavigation = Object.keys(organizedNavigation).map(parent => ({
      title: parent,
      children: organizedNavigation[parent],
    }));

    return finalNavigation;
  };

  const userRoleNavigation = (user.roleName === adminRoleName || user.roleName === superAdminRoleName) ? adminNavigation : userNavigation();
  return userRoleNavigation;

}
export default navigation
