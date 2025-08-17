import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, InputAdornment, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction';
import { changePassword } from 'src/api/utility/usermaster';
import { cancelIcon, eyeIcon, eyeLockIcon, saveIcon } from 'src/varibles/icons';
import * as yup from 'yup';

const schema = yup.object().shape({
    oldPassword: yup.string().required("Old Password is Required."),
    newPassword: yup
        .string()
        .required("New Password is Required.")
        .notOneOf([yup.ref('oldPassword')], 'New Password must be different from Old Password.')
        .matches(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/,
            "Password must be between 8 and 20 characters, include at least 1 uppercase letter, 1 digit, and 1 special character."
        )
        .min(8, 'Password must be at least 8 characters.'),

    confirmPassword: yup
        .string()
        .required("Confirm Password is Required.")
        .oneOf([yup.ref('newPassword'), null], 'New Password and Confirm Password must be the same.'),
});


const ChangePass = (props) => {
    const { handleResetPassDialogToggle, open, setOpen } = props

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleToggleOldPassword = () => {
        setShowOldPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleNewPassword = () => {
        setShowNewPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
    };

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    const router = useRouter()

    const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const user = (JSON.parse(localStorage.getItem('userData')))

    const onSubmit = async (data) => {
        try {
            const allData = { ...data, id: user.id };
            const response = await changePassword(allData);
            if (response.success) {
                showSuccessToast("Your password has been Changed.")
                user.forcePasswordChange = 0
                localStorage.setItem('userData', JSON.stringify(user))
                handleResetPassDialogToggle()
                router.replace('/dashboard')
                var loginData = JSON.parse(localStorage.getItem('loginData'));
                loginData.password = '';
                localStorage.setItem('loginData', JSON.stringify(loginData));
            }
        } catch (error) {
            showErrorToast("Error Changing password.")
            console.error(error);
        }
        reset()
    }


    return (
        <>
            <Dialog fullWidth maxWidth='sm' open={open} >
                <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Change Password
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Controller
                                    name='oldPassword'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            type={showOldPassword ? 'text' : 'password'}
                                            label='Old Password'
                                            onChange={onChange}
                                            error={Boolean(errors.oldPassword)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={handleToggleOldPassword} edge='end'>
                                                            {showOldPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {errors.oldPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.oldPassword.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 3 }}>

                                <Controller
                                    name='newPassword'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            type={showNewPassword ? 'text' : 'password'}
                                            label='New Password'
                                            onChange={onChange}
                                            error={Boolean(errors.newPassword)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={handleToggleNewPassword} edge='end'>
                                                            {showNewPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {errors.newPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 3 }}>

                                <Controller
                                    name='confirmPassword'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            label='Confirm Password'
                                            onChange={onChange}
                                            error={Boolean(errors.confirmPassword)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position='end'>
                                                        <IconButton onClick={handleToggleConfirmPassword} edge='end'>
                                                            {showConfirmPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {errors.confirmPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>}
                            </FormControl>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                    <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} /></Typography>
                                    <Typography sx={{ color: "white" }}>Save</Typography>
                                </Button>
                                {user.forcePasswordChange == 0 && <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleResetPassDialogToggle}>
                                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
                                    <Typography>Cancel</Typography>
                                </Button>}
                            </Box>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default ChangePass