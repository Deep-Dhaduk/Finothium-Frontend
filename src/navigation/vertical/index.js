import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import authConfig from 'src/configs/auth'
import { useAuth } from "src/hooks/useAuth"
import { fetchRoleWisePermission } from "src/store/apps/roleWisePermission"
import { adminRoleName, superAdminRoleName, tenantMaster } from "src/varibles/constant"
import { adminNavigation } from "src/varibles/navigation"
import { apiBaseUrl } from "src/varibles/variable"

const navigation = () => {
  const [childData, setChildData] = useState([])
  const [parentData, setParentData] = useState([])
  const auth = useAuth()

  const rolePermission = useSelector(store => store.roleWisePermission)
  const fetchChildMenuData = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    const response = await axios.get(`${apiBaseUrl}childmenu/list-childmenu`, {
      headers: {
        // 'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    },
    )
    setChildData(response.data.data)
  }

  const dispatch = useDispatch()

  const fetchParentMenuData = async () => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)
    const response = await axios.get(`${apiBaseUrl}parentmenu/list-parentmenu`, {
      headers: {
        // 'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    },
    )
    setParentData(response.data.data)
  }

  useEffect(() => {
    fetchChildMenuData()
    fetchParentMenuData()
  }, [])

  const adNavigation = () => {
    const updatedNavigation = adminNavigation.map(parentItem => {
      if (parentItem.children && parentItem.children.length > 0) {
        const children = parentItem.children.map(childItem => {
          if (childItem.title === tenantMaster && auth.user.roleName.toLowerCase() !== superAdminRoleName) {
            return null;
          }
          const menuItem = childData.find(item => item.menu_name === childItem.title);
          return menuItem ? { ...childItem, displayRank: menuItem.display_rank } : null;
        }).filter(Boolean);

        // Sort children based on display rank
        children.sort((a, b) => a.displayRank - b.displayRank);

        // Return only if at least one child has access
        if (children.length > 0) {
          return {
            title: parentItem.title,
            icon: parentItem.icon,
            children: children.map(childItem => ({
              title: childItem.title,
              path: childItem.path,
              allow_access: childItem.allow_access,
              parent: parentItem.title,
              action: 'read',
              subject: 'all',
              icon: childItem.icon, // Include icon from adminNavigation
            })),
          };
        }
      }
      // Return null if no children or none have access
      return null;
    }).filter(Boolean); // Remove any null values

    updatedNavigation.unshift({
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:view-dashboard',
      allow_access: true, // Assuming dashboard is always accessible
      action: 'read',
      subject: 'all'
    });

    // Sort the navigation items based on their display rank
    updatedNavigation.sort((a, b) => {
      const rankA = parentData.find(item => item.menu_name === a.title)?.display_rank || 0;
      const rankB = parentData.find(item => item.menu_name === b.title)?.display_rank || 0;
      return rankA - rankB;
    });
    return updatedNavigation;
  };

  useEffect(() => {
    if (auth.user) {
      dispatch(fetchRoleWisePermission(auth.user.roleId))
    }
  }, [])

  const userNavigation = () => {
    const updatedNavigation = adminNavigation.map(parentItem => {
      // Check if children exist
      if (parentItem.children && parentItem.children.length > 0) {
        // Filter children items based on allow_access from store.data
        const children = parentItem.children.filter(childItem => {
          const menuItem = rolePermission.data.find(item => item.child_menu_name === childItem.title);
          return menuItem && menuItem.allow_access === 1;
        });

        // Return only if at least one child has access
        if (children.length > 0) {
          return {
            title: parentItem.title,
            icon: parentItem.icon,
            children: children.map(childItem => ({
              title: childItem.title,
              path: childItem.path,
              parent: parentItem.title,
              action: 'read',
              subject: 'all',
            })),
          };
        }
      }
      // Return null if no children or none have access
      return null;
    }).filter(Boolean); // Remove any null values
    updatedNavigation.unshift({
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'mdi:view-dashboard',
      allow_access: true, // Assuming dashboard is always accessible
      action: 'read',
      subject: 'all'
    });
    return updatedNavigation;
  };


  // const userNavigation = () => {
  //   const updatedNavigation = store.data
  //     .filter(item => item.allow_access === 1)
  //     .map(item => ({
  //       title: item.child_menu_name,
  //       path: item.parent_menu_name
  //         ? `/${item.parent_menu_name.toLowerCase()}/${item.child_menu_name.toLowerCase().replace(/\s+/g, '-')}`
  //         : `/${item.child_menu_name.toLowerCase().replace(/\s+/g, '-')}`,
  //       allow_access: item.allow_access === 1,
  //       parent: item.parent_menu_name,
  //       action: 'read',
  //       subject: 'all',
  //     }));

  //   const organizedNavigation = updatedNavigation.reduce((acc, item) => {
  //     if (!acc[item.parent]) {
  //       acc[item.parent] = [];
  //     }
  //     acc[item.parent].push(item);
  //     return acc;
  //   }, {});

  //   const finalNavigation = Object.keys(organizedNavigation).map(parent => ({
  //     title: parent,
  //     children: organizedNavigation[parent],
  //   }));

  //   return finalNavigation;
  // };
  const userRoleNavigation = (auth.user.roleName.toLowerCase() === adminRoleName || auth.user.roleName.toLowerCase() === superAdminRoleName) ? adNavigation() : userNavigation();
  return userRoleNavigation;

}
export default navigation
