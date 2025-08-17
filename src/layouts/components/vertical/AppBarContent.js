// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import CompanyDropdown from 'src/@core/layouts/components/shared-components/CompanyDropdown'
import { Button, Link, Typography } from '@mui/material'
import MenuDropdown from 'src/@core/layouts/components/shared-components/Menu'
import { logoutIcon } from 'src/varibles/icons'
import { Router, useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { LoadingContext } from 'src/pages/_app'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const mainData = localStorage.getItem('MainUser')
  const mainToken = localStorage.getItem('MainToken')

  const router = useRouter()

  const handleBackHome = () => {
    try {
      setShowSpinner(true)
      localStorage.setItem("userData", mainData)
      localStorage.setItem("accessToken", mainToken)
      localStorage.removeItem('MainUser')
      localStorage.removeItem('MainToken')
      window.location.href = '/apps/utility/tenant/';
    } catch (error) {
    } finally {
      setTimeout(() => {
        setShowSpinner(false)
      }, 1000);
    }
  }


  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mx: 4 }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden && !settings.navHidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon icon='mdi:menu' />
          </IconButton>
        ) : null}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
        {mainData && <Box sx={{ mr: 3, display: { lg: 'block', md: 'block', sm: 'none', xs: 'none' } }} >
          <Link sx={{
            bgcolor: 'primary.main', display: 'flex', p: 2, borderRadius: '5px', color: 'white', cursor: 'pointer',
            ':hover': {
              textDecoration: 'none',
              bgcolor: 'primary.dark'
            }
          }} onClick={handleBackHome}>
            <Icon icon={logoutIcon} transform={'rotate(180deg)'} />
            <Typography sx={{ color: 'white', cursor: 'poiner', px: 2 }}>Back to Account</Typography>
          </Link>
        </Box>}
        <Box sx={{ mr: { lg: 3, md: 3, sm: 1, xs: 0.5 } }}>
          <CompanyDropdown settings={settings} saveSettings={saveSettings} />
        </Box>
        <Box sx={{
          mr: { lg: 3, md: 3, sm: 1, xs: 0.5 },
          display: { lg: 'block', md: 'block', sm: 'none', xs: 'none' }
        }}
        >
          <ModeToggler settings={settings} saveSettings={saveSettings} />
        </Box>
        <Box sx={{
          mr: { lg: 3, md: 3, sm: 3, xs: 3 },
          display: { lg: 'none', md: 'none', sm: 'block', xs: 'block' }
        }}>
          <MenuDropdown settings={settings} saveSettings={saveSettings} handleBackHome={handleBackHome} />
        </Box>
        <Box sx={{ mr: { lg: 3, md: 3, sm: 3, xs: 3 } }}>
          <UserDropdown settings={settings} saveSettings={saveSettings} />
        </Box>
      </Box>
    </Box >
  )
}

export default AppBarContent
