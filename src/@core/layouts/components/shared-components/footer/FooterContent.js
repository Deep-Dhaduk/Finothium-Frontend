import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { remindMsg } from 'src/allFunction/commonFunction';
import TenantExpire from 'src/component/tenantExpire';

const FooterContent = () => {
  const [tenantExpire, setTenantExpire] = useState(false)

  const handleTenantExpireDialogToggle = () => {
    setTenantExpire(!tenantExpire)
  }


  const theme = useTheme();

  const { title, message } = remindMsg()



  return (
    <Box sx={{ display: 'flex', justifyContent: `${title === '' ? 'center' : 'space-between'}`, alignItems: 'center' }}>
      <Link target='_blank' href='https://unblocktechnolabs.com/' sx={{
        textDecoration: 'none',
        color: '#666CFF', transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}>
        {` Powered by `}
        <Link sx={{
          textDecoration: 'none', color: theme.palette.mode === 'dark' ? '#EAEAFF' : '#4C4E64'
        }}>
          Unblock Technolabs
        </Link>
      </Link>
      {title && (
        <>
          <Typography
            sx={{
              textAlign: 'right',
              color: 'error.main',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={handleTenantExpireDialogToggle}
          >
            {title}⚠️
          </Typography>
          {tenantExpire && <TenantExpire handleTenantExpireDialogToggle={handleTenantExpireDialogToggle} open={tenantExpire} />}
        </>
      )}
    </Box>
  );
}

export default FooterContent;
