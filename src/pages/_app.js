// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'

// ** Store Imports
import { store } from 'src/store'
import { Provider } from 'react-redux'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import 'src/configs/i18n'
import { defaultACLObj } from 'src/configs/acl'
import themeConfig from 'src/configs/themeConfig'

// ** Fake-DB Import
import 'src/@fake-db'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import AclGuard from 'src/@core/components/auth/AclGuard'
import ThemeComponent from 'src/@core/theme/ThemeComponent'
import AuthGuard from 'src/@core/components/auth/AuthGuard'
import GuestGuard from 'src/@core/components/auth/GuestGuard'
import WindowWrapper from 'src/@core/components/window-wrapper'
import 'react-toastify/dist/ReactToastify.css';
// ** Spinner Import
import FallbackSpinner from 'src/@core/components/spinner'

// ** Contexts
import { AuthProvider } from 'src/context/AuthContext'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from 'src/@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** Prismjs Styles
import 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'src/iconify-bundle/icons-bundle-react'

// ** Global css styles
import '../../styles/globals.css'
import { createContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import Spinner from 'src/component/spinner'
import { subMonths } from 'date-fns'
import { defaultDateRange } from 'src/varibles/variable'
import { fetchCompanySetting } from 'src/api/setting'
import { fetchFiscalDate, getFiscalAndFrequencyYearMonth, getStartDate } from 'src/allFunction/commonFunction'
import { useAuth } from 'src/hooks/useAuth'
import { adminNavigation, navAllChildren } from 'src/varibles/navigation'

const clientSideEmotionCache = createEmotionCache()

const Guard = ({ children, authGuard, guestGuard }) => {
  if (guestGuard) {
    return <GuestGuard fallback={<FallbackSpinner />}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>
  } else {
    return <AuthGuard fallback={<FallbackSpinner />}>{children}</AuthGuard>
  }
}


export const LoadingContext = createContext()
export const DateRangeContext = createContext()
export const ReportViewContext = createContext()
export const FiscalContext = createContext()

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const [showSpinner, setShowSpinner] = useState(false)
  const [pageTitle, setPageTitle] = useState('')
  const [settingDate, setSettingDate] = useState({ fromDate: subMonths(new Date(), 1), toDate: new Date(), dateRange: defaultDateRange })
  const [fiscalDate, setFiscalDate] = useState({ currentFiscal: {}, lastFiscal: {}, fiscalStartMonth: 4 })
  const [reportViewSetting, setReportViewSetting] = useState({ summary: true, detail: true, chart: true })

  const router = useRouter();

  const auth = useAuth()
  // ** Pace Loader
  if (themeConfig.routingLoader) {
    Router.events.on('routeChangeStart', () => {
      NProgress.start()
      setShowSpinner(true);
    })
    Router.events.on('routeChangeError', () => {
      NProgress.done()
      setShowSpinner(false);
    })
    Router.events.on('routeChangeComplete', () => {
      NProgress.done()
      setShowSpinner(false);
    })
  }


  // Variables
  const contentHeightFixed = Component.contentHeightFixed ?? false

  const getLayout =
    Component.getLayout ?? (page => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>)
  const setConfig = Component.setConfig ?? undefined
  const authGuard = Component.authGuard ?? true
  const guestGuard = Component.guestGuard ?? false
  const aclAbilities = Component.acl ?? defaultACLObj

  const fetchData = async () => {
    const responseSetting = await fetchCompanySetting()
    setFiscalDate({ ...fiscalDate, fiscalStartMonth: responseSetting.data[0].fiscal_start_month })
  }

  const getFiscalDate = (fiscalStartMonth) => {
    const data = fetchFiscalDate(fiscalStartMonth)
    setFiscalDate({ ...fiscalDate, currentFiscal: data.currentFiscalData, lastFiscal: data.lastFiscalData })
  }

  useEffect(() => {
    getFiscalDate(fiscalDate.fiscalStartMonth)
  }, [fiscalDate.fiscalStartMonth])


  useEffect(() => {
    if (auth.user) {
      fetchData();
    }
  }, [])



  useEffect(() => {
    const reportView = localStorage.getItem('reportView')
    if (reportView) {
      const reportViewData = (JSON.parse(localStorage.getItem('reportView')));
      setReportViewSetting(reportViewData)
    } else {
      localStorage.setItem('reportView', JSON.stringify(reportViewSetting));
    }
  }, []);


  const handleRouteChange = () => {

    const navChild = navAllChildren.find(x => x.path === router.pathname);
    if (navChild) {
      const navTitle = navChild.title ? `${navChild.title} -` : ''
      setPageTitle(navTitle);
    }
  };

  useEffect(() => {
    handleRouteChange()
  }, [router.pathname]);



  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${pageTitle} ${themeConfig.templateName}`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName} – Welcome to simplicity in finothium. Our Finance Management Website offers admins a user-friendly platform to create roles, manage users, and track company expenses with ease.`}
          />
          <meta name='keywords' content='Finothium, Finance, Account, Admin panel, Management, Money' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <DateRangeContext.Provider value={{ settingDate, setSettingDate }}>
          <FiscalContext.Provider value={{ fiscalDate, setFiscalDate }}>
            <ReportViewContext.Provider value={{ reportViewSetting, setReportViewSetting }}>
              <LoadingContext.Provider value={{ showSpinner, setShowSpinner }}>
                <AuthProvider>
                  <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                    <SettingsConsumer>
                      {({ settings }) => {
                        return (
                          <ThemeComponent settings={settings} >
                            <WindowWrapper>
                              <Guard authGuard={authGuard} guestGuard={guestGuard}>
                                {showSpinner && <Spinner loading={showSpinner} />}

                                <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                                  {getLayout(<Component {...pageProps} />)}
                                </AclGuard>
                                <ToastContainer />
                              </Guard>
                            </WindowWrapper>
                            <ReactHotToast>
                              <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                            </ReactHotToast>
                          </ThemeComponent>
                        )
                      }}
                    </SettingsConsumer>
                  </SettingsProvider>
                </AuthProvider>
              </LoadingContext.Provider>
            </ReportViewContext.Provider>
          </FiscalContext.Provider>
        </DateRangeContext.Provider>
      </CacheProvider>
    </Provider>
  )
}

export default App
