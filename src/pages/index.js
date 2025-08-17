// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Router, { useRouter } from 'next/router'

// ** Hook Imports
import { fetchMenuData } from 'src/store/apps/permissions'
import { useDispatch } from 'react-redux'
import ChangePass from 'src/component/changePassword'
import TenantExpire from 'src/component/tenantExpire';
import { getDecodedTokenValue } from 'src/allFunction/commonFunction';
import { tenantExpireWarningDays } from 'src/varibles/constant';
/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = () => {
    return '/dashboard'
}

const Home = () => {
    const [open, setOpen] = useState(true)
    const [tenantExpire, setTenantExpire] = useState(false)
    const [user, setUser] = useState({})
    const router = useRouter()
    const dispatch = useDispatch()

    const handleResetPassDialogToggle = () => {
        setOpen(!open)
    }

    const handleTenantExpireDialogToggle = () => {
        setTenantExpire(!tenantExpire)
        router.replace('/dashboard')
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('userData')))
    }, [])

    const remainingTenantDays = getDecodedTokenValue()

    useEffect(() => {
        const homeRoute = getHomeRoute()
        if (user.forcePasswordChange === 1) {
            setOpen(true)
        } else if (remainingTenantDays.tenantDays <= tenantExpireWarningDays || user.tenantStatus === 0) {
            setTenantExpire(true)
        } else {
            if (user && user.roleName) {
                router.replace(homeRoute)
            }
        }
    }, [user, router])

    useEffect(() => {
        if (user.forcePasswordChange === 1) {
            Router.events.on('routeChangeComplete', () => {
                setOpen(true);
            })
        }
    }, [router])

    useEffect(() => {
        dispatch(fetchMenuData())
    }, [dispatch])

    return (
        <>
            {user.forcePasswordChange === 1 && <ChangePass handleResetPassDialogToggle={handleResetPassDialogToggle} open={open} setOpen={setOpen} />}
            {tenantExpire && <TenantExpire handleTenantExpireDialogToggle={handleTenantExpireDialogToggle} open={tenantExpire} />}
        </>
    )
}

export default Home