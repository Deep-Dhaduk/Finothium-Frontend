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

const Error404 = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1' sx={{ mb: 2.5 }}>
            404
          </Typography>
          <Typography variant='h5' sx={{ mb: 2.5, letterSpacing: '0.18px', fontSize: '1.5rem !important' }}>
            Page Not Found ⚠️
          </Typography>
          <Typography variant='body2'>We couldn&prime;t find the page you are looking for.</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button href='/' component={Link} variant='contained' sx={{ mt: 5 }} >
              <Typography sx={{ display: 'flex', color: 'white' }}>
                <Icon icon={backToHomeIcon} fontSize={20} />
              </Typography>
              <Typography sx={{ color: 'white', ml: 1 }}>Back to Home</Typography>
            </Button>
          </Box>
        </BoxWrapper>
        <Img alt='error-illustration' src='/images/pages/404.png' />
      </Box>
      <FooterIllustrations image='/images/pages/misc-404-object.png' />
    </Box>
  )
}
Error404.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default Error404
