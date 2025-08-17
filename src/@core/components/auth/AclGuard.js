// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'

// ** Component Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'

// ** Hooks
import { useDispatch, useSelector } from 'react-redux'
import { checkGuardAllowAccess } from 'src/allFunction/commonFunction'
import { useAuth } from 'src/hooks/useAuth'
import { fetchRoleWisePermission } from 'src/store/apps/roleWisePermission'
import { adminRoleName, superAdminRoleName } from 'src/varibles/constant'

const AclGuard = props => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props
  const [ability, setAbility] = useState(undefined)
  const objectsArray = useSelector(store => store.roleWisePermission)
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const user = auth.user


  useEffect(() => {
    if (auth.user) {
      dispatch(fetchRoleWisePermission(user.roleId))
    }
  }, [])

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  // User is logged in, build ability for the user based on his role
  if (auth.user && auth.user.roleName && !ability) {
    setAbility(buildAbilityFor(auth.user.roleName.toLowerCase(), aclAbilities.subject))
  }


  if (user.roleName.toLowerCase() !== superAdminRoleName && router.route === '/apps/utility/tenant') {
    return (
      <BlankLayout>
        <NotAuthorized />
      </BlankLayout>
    )
  }

  if (router.route === '/dashboard' || objectsArray.data.length === 0 || user.roleName.toLowerCase() == superAdminRoleName || user.roleName.toLowerCase() == adminRoleName) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  if (router.route !== '/settings') {
    const checkpermission = checkGuardAllowAccess(objectsArray.data, router.pathname)
    if (checkpermission) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
