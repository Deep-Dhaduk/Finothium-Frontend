// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { FormControl, FormHelperText } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import VerifyOtp from 'src/component/verifyOtp'
import { apiBaseUrl, mainDarkLogo, mainLightLogo } from 'src/varibles/variable'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import * as yup from "yup"
import { LoadingContext } from '../_app'
// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(2)
  }
}))

const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  '& svg': { mr: 1.5 },
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  email: yup.string().required("Email is Required.")
})

const defaultValues = {
  email: '',
}



const ForgotPassword = () => {

  const [open, setOpen] = useState(false)
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })
  // ** Vars
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()

  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const forgetPassword = async (data) => {
    try {
      const response = await axios.post(`${apiBaseUrl}user/forgot-password`, {
        email: data.email
      });

      return response.data;
    } catch (error) {
      showErrorToast('Error in forgetPassword:');
      throw error;
    }
  };

  const onSubmit = async (data) => {

    setShowSpinner(true)
    const response = await forgetPassword(data)
    if (response.error) {
      showSuccessToast("Error in ForgetPassword")
    } else {
      showSuccessToast("Otp send your email")
      setShowSpinner(false)
      setOpen(!open)
    }

  }

  const handleDialogToggle = () => {
    setOpen(!open)

  }

  const imageSource =
    skin === 'bordered' ? 'auth-v2-forgot-password-illustration-bordered' : 'auth-v2-forgot-password-illustration'
  const logoSource = theme.palette.mode === 'dark' ? mainDarkLogo : mainLightLogo

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <ForgotPasswordIllustrationWrapper>
            <ForgotPasswordIllustration
              alt='forgot-password-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </ForgotPasswordIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-forgot-password-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >

              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                <img src={logoSource} width='auto' height='40px' alt='logo' />

              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Forgot Password? 🔒</TypographyStyled>
              <Typography variant='body2'>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography>
            </Box>
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 5 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}

              </FormControl>
              <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }}>
                Send OTP
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LinkStyled href='/login'>
                  <Icon icon='mdi:chevron-left' fontSize='2rem' />
                  <span>Back to login</span>
                </LinkStyled>
              </Typography>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
      {open ? <VerifyOtp handleDialogToggle={handleDialogToggle} open={open} /> : null}

    </Box>
  )
}
ForgotPassword.guestGuard = true
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotPassword
