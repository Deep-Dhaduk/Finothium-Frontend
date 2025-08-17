// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import { useEffect } from 'react'
import { Typography } from '@mui/material'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { addClass } from 'src/allFunction/commonFunction'

const ModeToggler = props => {
  // ** Props
  const { settings, saveSettings } = props

  const handleModeChange = mode => {
    saveSettings({ ...settings, mode: mode })
  }

  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark')
      addClass()
    } else {
      handleModeChange('light')
      addClass()
    }
    document.documentElement.style.setProperty('--scrollbar-color', getScrollbarColor());
  }

  function getScrollbarColor() {
    const storedDataString = localStorage.getItem('settings');
    const storedData = storedDataString ? JSON.parse(storedDataString) : {};
    const themeColor = storedData.themeColor;
    switch (themeColor) {
      case 'primary':
        return '#666CFF';
      case 'secondary':
        return '#6D788D';
      case 'success':
        return '#72E128';
      case 'error':
        return '#FF4D49';
      case 'warning':
        return '#FDB528';
      case 'info':
        return '#26C6F9';
      default:
        return '#666CFF'; // Default color
    }
  }

  useEffect(() => {
    addClass()
  }, [])


  return (
    <IconButton sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }} color='inherit' aria-haspopup='true' onClick={handleModeToggle}>
      <Icon icon={settings.mode === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'} />
      <Typography sx={{
        pl: 2,
        display: { lg: 'none', md: 'none', sm: 'block', xs: 'block' }
      }}>{settings.mode === 'dark' ? ' Light' : ' Dark '} Mode</Typography>
    </IconButton>
  )
}

export default ModeToggler
