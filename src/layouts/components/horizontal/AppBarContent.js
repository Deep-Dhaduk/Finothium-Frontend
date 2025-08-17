// ** MUI Imports
import Box from '@mui/material/Box'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import CompanyDropdwon from 'src/@core/layouts/components/shared-components/CompanyDropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
      <Box sx={{ mr: 5 }}>
        <CompanyDropdwon settings={settings} saveSettings={saveSettings} />
      </Box>
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      <UserDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent
