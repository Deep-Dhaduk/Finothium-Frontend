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
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'

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
import { cancelIcon, changePasswordIcon, eyeIcon, eyeLockIcon, logoutIcon, profileIcon, saveIcon, settingIcon } from 'src/varibles/icons'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { adminRoleName, superAdminRoleName } from 'src/varibles/constant'
import ChangePass from 'src/component/changePassword'
import ModeToggler from './ModeToggler'

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

const UserDropdown = props => {
  // ** Props
  const { settings, saveSettings } = props

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
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {user && user.profile_image_filename ?
          <img
            src={user.profile_image_filename}
            alt="Profile"
            style={{ marginRight: '10px', width: '34px', height: '34px', borderRadius: '50%' }}
          />
          :
          <CustomAvatar
            skin='light'
            color={'primary'}
            sx={{ width: 40, height: 40 }}
          >
            {getInitials(user.fullname && user.fullname.toUpperCase())}
          </CustomAvatar>
        }
        {/* <Avatar
          alt='profile-avatar'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={`http://localhost:8080/Images/Profile_Images/${user.profile_image_filename}`}
        /> */}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              {user && user.profile_image_filename ?
                <img
                  src={user.profile_image_filename}
                  alt="Profile"
                  style={{ marginRight: '10px', width: '34px', height: '34px', borderRadius: '50%' }}
                />
                :
                <CustomAvatar
                  skin='light'
                  color={'primary'}
                  sx={{ width: 40, height: 40 }}
                >
                  {getInitials(user.fullname && user.fullname.toUpperCase())}
                </CustomAvatar>
              }
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user.fullname}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {user.roleName}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: '0 !important' }} />
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/user-profile/profile')}>
          <Box sx={styles}>
            <Icon icon={profileIcon} />
            Profile
          </Box>
        </MenuItem> */}
        {(user.roleName.toLowerCase() === adminRoleName || user.roleName.toLowerCase() === superAdminRoleName) && <MenuItem
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
          onClick={() => {
            router.replace('/settings')
            setAnchorEl(null)
          }}
        >
          <Icon icon={settingIcon} />
          Settings
        </MenuItem>}
        <MenuItem
          onClick={handleResetPassword}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon={changePasswordIcon} />
          Change Password
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem', color: 'text.primary' } }}
        >
          <Icon icon={logoutIcon} />
          Logout
        </MenuItem>
      </Menu>
      <ChangePass handleResetPassDialogToggle={handleResetPassDialogToggle} open={open} />
    </Fragment>
  )
}

export default UserDropdown
