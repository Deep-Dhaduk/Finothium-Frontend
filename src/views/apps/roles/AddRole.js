import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addRole } from 'src/api/utility/roleMaster'
import { LoadingContext } from 'src/pages/_app'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import * as yup from 'yup'


const defaultValues = {
    roleName: '',
    status: '',
}

const schema = yup.object().shape({
    roleName: yup.string().required("Role Name is Required.")
})

const AddRole = (props) => {
    const { open, handleClose, setRoleData, value } = props

    const [radioValue, setRadioValue] = useState(1);
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const dispatch = useDispatch()

    const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const handleRadioChange = event => {
        setRadioValue(event.target.value)
    }

    const onSubmit = async (data) => {
        try {
            setShowSpinner(true);
            const allData = { ...data, status: radioValue, params: { q: value } };
            const response = await addRole(allData);
            setRoleData(response.data)
            if (response.success) {
                showSuccessToast("Role Saved Successfully.");
                reset();
                handleClose();
            }
            else {
                showErrorToast(response.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            showErrorToast(error.response.data.message ? error.response.data.message : "An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };


    return (
        <>
            <Dialog fullWidth maxWidth='sm' scroll='body' onClose={handleClose} open={open}>
                <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
                    <Typography variant='h6' component='span'>
                        Add Role
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ p: 2 }}>
                            <FormControl fullWidth >
                                <Controller
                                    name='roleName'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Role Name'
                                            autoFocus
                                            onChange={onChange}
                                            error={Boolean(errors.roleName)}
                                        />
                                    )}
                                />
                                {errors.roleName && <FormHelperText sx={{ color: 'error.main' }}>{errors.roleName.message}</FormHelperText>}

                            </FormControl>
                        </Box>
                        <Grid container spacing={6} sx={{ mb: 6, px: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <RadioGroup row aria-label='controlled' name='controlled' value={radioValue} onChange={handleRadioChange}>
                                    <FormControlLabel value={1} control={<Radio />} label='Active' />
                                    <FormControlLabel value={0} control={<Radio />} label='InActive' />
                                </RadioGroup>
                            </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} fontSize={20} /></Typography>
                                <Typography sx={{ color: "white" }}>Save</Typography>
                            </Button>
                            <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                                <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                                <Typography>Cancel</Typography>
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AddRole