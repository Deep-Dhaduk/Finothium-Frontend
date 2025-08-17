// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'
import { getInitials } from 'src/@core/utils/get-initials'
import { Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { changePassword } from 'src/store/apps/user'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { cancelIcon, changePasswordIcon, eyeIcon, eyeLockIcon, logoutIcon, menuIcon, profileIcon, saveIcon, settingIcon } from 'src/varibles/icons'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { adminRoleName, superAdminRoleName } from 'src/varibles/constant'
import ChangePass from 'src/component/changePassword'
import ModeToggler from './ModeToggler'
import CompanyDropdown from './CompanyDropdown'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is Required."),
  newPassword: yup
    .string()
    .required("New Password is Required.")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/,
      "Password must be between 8 and 20 characters, include at least 1 uppercase letter, 1 digit, and 1 special character."
    )
    .min(8, 'Password must be at least 8 characters.'),

  confirmPassword: yup
    .string()
    .required("Confirm Password is Required.")
    .oneOf([yup.ref('newPassword'), null], 'New Password and Confirm Password must be same.'),
})

const defaultValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

const MenuDropdown = props => {
  // ** Props
  const { settings, saveSettings, handleBackHome } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [open, setOpen] = useState(false)


  // ** Hooks
  const router = useRouter()
  const { logout } = useAuth()


  // ** Vars
  const { direction } = settings

  const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })


  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }
  let user = JSON.parse(localStorage.getItem("userData"))

  const dispatch = useDispatch()
  const onSubmit = async (data) => {
    try {
      const allData = { ...data, id: user.id };
      const response = await dispatch(changePassword(allData));

      if (response.payload.success === true) {
        handleResetPassDialogToggle();
        showSuccessToast("Your password has been Changes.")

        // Close the reset password dialog
      }
    } catch (error) {
      // Display an error alert
      showErrorToast("Error Changing password.")

      // Optionally, log the error or take other actions
      console.error(error);
    }
    reset()
  }

  const mainData = localStorage.getItem('MainUser')

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2,
      fontSize: '1.375rem',
      color: 'text.primary'
    }
  }

  const handleResetPassword = () => setOpen(!open)

  const handleResetPassDialogToggle = () => {
    setOpen(!open)
    setAnchorEl(null)
    reset()
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }


  return (
    <Fragment>
      <Box onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer', display: 'flex' }}>
        <Icon icon={menuIcon} />
      </Box>
      <Menu anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}>
        <MenuItem sx={{ height: '40px' }}>
          <Box sx={{ my: 3 }}>
            <Box sx={{ display: 'flex', my: 2, mr: { lg: 3, md: 3, sm: 1, xs: 0.5, cursor: 'pointer', } }}>
              <ModeToggler settings={settings} saveSettings={saveSettings} />
              {/* <Typography sx={{ pl: 2 }}>{settings.mode === 'dark' ? 'Light' : 'Dark'} Mode</Typography> */}
            </Box>
          </Box>
        </MenuItem>

        {mainData &&
          <MenuItem sx={{ height: '40px' }}>
            <Box sx={{ mr: 3, my: 3 }}>
              <Box sx={{ display: 'flex', pt: 1.5, borderRadius: '5px', cursor: 'pointer' }} onClick={handleBackHome}>
                <Icon icon={logoutIcon} transform={'rotate(180deg)'} />
                <Typography sx={{ color: 'white', mx: 2 }}>Back to Account</Typography>
              </Box>
            </Box>
          </MenuItem>}

      </Menu>
    </Fragment >
  )
}

export default MenuDropdown
