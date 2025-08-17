import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Icon from 'src/@core/components/icon';
import { remindMsg } from 'src/allFunction/commonFunction';
import { remindMeLaterIcon } from 'src/varibles/icons';

const TenantExpire = (props) => {

    const { handleTenantExpireDialogToggle, open } = props

    const { title, message } = remindMsg()

    const Img = styled('img')(({ theme }) => ({
        height: '40vh',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }))

    return (

        <Dialog fullWidth maxWidth='sm' onClose={handleTenantExpireDialogToggle} open={open} >
            <Box sx={{ p: 5 }}>
                <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        {title} ⚠️
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', fontSize: '20px' }}>
                    <Typography>
                        {message}
                    </Typography>
                    <Box mt={4}><Img alt='error-illustration' src='/images/pages/misc-coming-soon.png' /></Box>
                    {/* <Button onClick={() => {
                        router.replace('/dashboard')
                        handleTenantExpireDialogToggle()
                    }} variant='contained' sx={{ px: 5.5, mt: 5 }}>
                        Remind Me Later...
                    </Button> */}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={handleTenantExpireDialogToggle} variant='contained' sx={{ px: 5.5, mt: 5 }} >
                            <Typography sx={{ display: 'flex', color: 'white' }}>
                                <Icon icon={remindMeLaterIcon} fontSize={20} />
                            </Typography>
                            <Typography sx={{ color: 'white', ml: 1 }}> Remind Me Later...</Typography>
                        </Button>
                    </Box>

                </DialogContent>
            </Box>
        </Dialog>
    )
}

export default TenantExpire