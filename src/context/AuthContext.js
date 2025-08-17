'use client'
// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import themeConfig from 'src/configs/themeConfig'
import { decryptPassword, encryptPassword } from 'src/allFunction/commonFunction'
// import { getDecodedToken } from 'src/allFunction/commonFunction'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

// const decodedExpire = getDecodedToken();

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // ** Hooks
  const router = useRouter()
  const initAuth = async () => {
    const storedToken = localStorage.getItem('accessToken')

    if (storedToken) {
      setLoading(true)
      await axios
        .get(`${apiBaseUrl}user/single-record`, {
          headers: {
            authorization: `Bearer ${storedToken}`
          }
        })
        .then(async response => {
          setLoading(false)
          setUser(response.data.data)
        })
        .catch(() => {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          localStorage.removeItem('MainToken')
          localStorage.removeItem('MainUser')
          setUser(null)
          setLoading(false)
          if (authConfig.storageTokenKeyName === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        })
    } else {
      setLoading(false)
      router.replace('/login')
    }
  }

  useEffect(() => {
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {

    axios
      .post(`${apiBaseUrl}user/login`, params)
      .then(async response => {
        localStorage.setItem("accessToken", response.data.token)
        const theme = themeConfig.mode
        const settings = JSON.parse(localStorage.getItem("settings"))
        !settings ? localStorage.setItem("settings", JSON.stringify({ mode: theme })) : settings
        const returnUrl = router.query.returnUrl
        setUser(response.data.userData)
        params ? localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        if (params.rememberMe) {
          const encryptedPassword = encryptPassword(params.password);
          localStorage.setItem("loginData", JSON.stringify({ email: params.email, password: encryptedPassword }));
        } else {
          localStorage.removeItem("loginData");
        }
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.push(redirectURL)
        // initAuth()
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })

  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    localStorage.removeItem('MainToken')
    localStorage.removeItem('MainUser')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }



  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
