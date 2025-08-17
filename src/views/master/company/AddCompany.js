// ** React Imports
import { useContext, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingContext } from 'src/pages/_app'
import * as yup from 'yup'


// ** Icon Imports

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addCompany } from 'src/api/master/companyMaster'
import { cancelIcon, saveIcon } from 'src/varibles/icons'

const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
        return `${field} field is Required.`
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters.`
    } else {
        return ''
    }
}

const schema = yup.object().shape({
    companyName: yup.string().required("Company Name is Required."),
    legalName: yup.string().required("Legal Name is Required."),
    authorizePersonName: yup.string().required("Authorize Person Name is Required."),
    GSTIN: yup.string().required("GSTIN is Required."),
    PAN: yup.string().required("PAN is Required."),
})

const defaultValues = {
    companyName: '',
    legalName: '',
    authorizePersonName: '',
    address: '',
    contactNo: '',
    email: '',
    website: '',
    PAN: '',
    GSTIN: '',
    status: '',
}

const SidebarAddCompany = props => {
    // ** Props
    const [radioValue, setRadioValue] = useState(1)
    const [loading, setLoading] = useState(false)
    const { handleClose, handleDialogToggle, open, setCompanyData, value } = props
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const dispatch = useDispatch()

    const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const handleRadioChange = event => {
        setRadioValue(event.target.value)
    }

    const onSubmit = async (data) => {
        try {
            setShowSpinner(true);
            const allData = { ...data, status: radioValue };
            const response = await addCompany(allData, { q: value });
            setCompanyData(response.data)
            if (!response.success) {
                showErrorToast(response.message);
            } else {
                reset();
                handleClose();
                showSuccessToast("Company Saved Successfully.");
            }
        } catch (error) {

            console.error("An error occurred synchronously:", error);
            showErrorToast(error.response.data.message ? error.response.data.message : "An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };

    return (
        <>
            <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
                <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h5' component='span' sx={{ mb: 2 }}>
                        Add Company
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>


                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Controller
                                            name='companyName'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Company Name'
                                                    autoFocus
                                                    onChange={onChange}
                                                    error={Boolean(errors.companyName)}
                                                />
                                            )}
                                        />
                                        {errors.companyName && <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='legalName'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Legal Name'
                                                    onChange={onChange}
                                                    error={Boolean(errors.legalName)}
                                                />
                                            )}
                                        />
                                        {errors.legalName && <FormHelperText sx={{ color: 'error.main' }}>{errors.legalName.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Controller
                                            name='authorizePersonName'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type='text'
                                                    value={value}
                                                    label='Authorize Person Name'
                                                    onChange={onChange}
                                                    error={Boolean(errors.authorizePersonName)}
                                                />
                                            )}
                                        />
                                        {errors.authorizePersonName && <FormHelperText sx={{ color: 'error.main' }}>{errors.authorizePersonName.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='website'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type='text'
                                                    fullWidth
                                                    value={value}
                                                    label='Website'
                                                    onChange={onChange}
                                                    error={Boolean(errors.website)}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='address'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Address'
                                            fullWidth
                                            multiline
                                            maxRows={6}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            </FormControl>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Controller
                                            name='email'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type='email'
                                                    value={value.toLocaleLowerCase()}
                                                    label='Email'
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>

                                        <Controller
                                            name='contactNo'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Contact No'
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Controller
                                            name='PAN'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type='text'
                                                    value={value.toUpperCase()}
                                                    label='PAN'
                                                    onChange={onChange}
                                                    error={Boolean(errors.PAN)}
                                                />
                                            )}
                                        />
                                        {errors.PAN && <FormHelperText sx={{ color: 'error.main' }}>{errors.PAN.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <Controller
                                            name='GSTIN'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    type='text'
                                                    value={value.toUpperCase()}
                                                    label='GSTIN'
                                                    onChange={onChange}
                                                    error={Boolean(errors.GSTIN)}
                                                />

                                            )}
                                        />
                                        {errors.GSTIN && <FormHelperText sx={{ color: 'error.main' }}>{errors.GSTIN.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={6} sx={{ mb: 5 }}>
                                <Grid item xs={12} sm={6}>
                                    <RadioGroup row aria-label='controlled' name='controlled' value={radioValue} onChange={handleRadioChange}>
                                        <FormControlLabel value={1} control={<Radio />} label='Active' />
                                        <FormControlLabel value={0} control={<Radio />} label='InActive' />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default SidebarAddCompany
