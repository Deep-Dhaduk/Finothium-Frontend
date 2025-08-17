import React from 'react'
import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { defaultRowMessage } from 'src/varibles/variable'

const MessageCard = () => {

    const Img = styled('img')(({ theme }) => ({
        marginTop: theme.spacing(5),
        [theme.breakpoints.down('lg')]: {
            height: 600,
            marginTop: theme.spacing(5),
        },
        [theme.breakpoints.down('md')]: {
            height: 400
        }
    }))

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'center', height: '97%', alignItems: 'center', flexDirection: 'column' }}>
                <Box>
                    <Img alt='error-illustration' src='/images/pages/pricing-cta-illustration.png' />
                </Box>
                <Box sx={{ mb: '2.25rem' }}>
                    <Typography mt={2} variant='h6'>{defaultRowMessage}</Typography>
                </Box>
            </Card>
        </>
    )
}

export default MessageCard
