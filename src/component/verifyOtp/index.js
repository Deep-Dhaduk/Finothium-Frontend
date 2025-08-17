import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { LoadingContext } from 'src/pages/_app'
import { eyeIcon, eyeLockIcon, saveIcon } from 'src/varibles/icons'
import { apiBaseUrl } from 'src/varibles/variable'
import * as yup from 'yup'

const schema = yup.object().shape({
    email: yup.string().required("Email is Required."),
    otp: yup.string().required("OTP is Required."),
    newPassword: yup
        .string()
        .required("Password is Required.")
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/,
            "Password must be between 8 and 20 characters, include at least 1 uppercase letter, 1 digit, and 1 special character."
        )
        .min(8, 'Password must be at least 8 characters.'),
})

const defaultValues = {
    email: '',
    otp: '',
    newPassword: ''
}

const VerifyOtp = (props) => {
    const { open, handleDialogToggle } = props
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter()
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const handleToggleNewPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const forgetPassword = async (data) => {
        try {
            const response = await axios.post(`${apiBaseUrl}user/verify-password`, {
                email: data.email,
                otp: data.otp,
                newPassword: data.newPassword
            });
            return response.data;
        } catch (error) {
            showErrorToast("Invalid Otp");
            throw error;
        }
    };

    const onSubmit = async (data) => {
        setShowSpinner(true)
        const response = await forgetPassword(data)
        if (response.error) {
            showSuccessToast("Error in ForgetPassword")
        } else {
            showSuccessToast("Password Reset Successfully")
            localStorage.removeItem('loginData')
            setShowSpinner(false)
            router.push("/login")
        }

    }


    const handleClose = () => {

    }
    return (
        <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
            <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                    Verify OTP
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 4 }}>
                <Box sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth sx={{ mb: 3 }}>

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
                        <FormControl fullWidth sx={{ mb: 3 }}>

                            <Controller
                                name='otp'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='OTP'
                                        onChange={onChange}
                                        error={Boolean(errors.otp)}
                                    />
                                )}
                            />
                            {errors.otp && <FormHelperText sx={{ color: 'error.main' }}>{errors.otp.message}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 3 }}>

                            <Controller
                                name='newPassword'
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        type={showPassword ? 'text' : 'password'}
                                        label='Password'
                                        onChange={onChange}
                                        error={Boolean(errors.newPassword)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton onClick={handleToggleNewPassword} edge='end'>
                                                        {showPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            {errors.newPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>}
                        </FormControl>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} /></Typography>
                                <Typography sx={{ color: "white" }}>Save</Typography>
                            </Button>
                            {/* <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                                <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
                                <Typography>Cancel</Typography>
                            </Button> */}
                        </Box>
                    </form>
                </Box>
            </DialogContent>
        </Dialog >
    )
}

export default VerifyOtp