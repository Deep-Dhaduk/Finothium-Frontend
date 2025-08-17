// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import Icon from 'src/@core/components/icon'
import { backToHomeIcon } from 'src/varibles/icons'

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  height: '45vh',
  marginTop: theme.spacing(10),
  marginBottom: theme.spacing(10),
}))

const Error401 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            401
          </Typography>
          <Typography variant='h6' sx={{ mb: 2.5, fontSize: '1.5rem !important' }}>
            You are not authorized! 🔐
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
          {/* <Button href='/' component={Link} variant='contained' sx={{ px: 5.5, mt: 5 }}>
            Back to Home
          </Button> */}

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button href='/' component={Link} variant='contained' sx={{ mt: 5 }} >
              <Typography sx={{ display: 'flex', color: 'white' }}>
                <Icon icon={backToHomeIcon} fontSize={20} />
              </Typography>
              <Typography sx={{ color: 'white', ml: 1 }}>Back to Home</Typography>
            </Button>
          </Box>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/401.png' />
      </Box>
      <FooterIllustrations image='/images/pages/misc-401-object.png' />
    </Box>
  )
}
Error401.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error401
