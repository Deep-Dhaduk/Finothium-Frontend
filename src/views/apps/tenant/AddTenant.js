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
import { useTheme } from '@mui/material/styles'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { getNextYearDate, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { LoadingContext } from 'src/pages/_app'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'


// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Icon Imports

// ** Store Imports

// ** Actions Imports
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { addTenant } from 'src/api/utility/tenantMaster'
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
    tenantName: yup.string().required("Tenant Name is Required."),
    personName: yup.string().required("Person Name is Required."),
    address: yup.string().required("Address is Required."),
    contactNo: yup.string().required("Contact No is Required."),
    email: yup.string().email().required("Email is Required."),
    // startDate: yup.string().required(),
    // endDate: yup.string().required(),
})

const defaultValues = {
    tenantName: '',
    personName: '',
    address: '',
    contactNo: '',
    email: '',
    startDate: '',
    endDate: '',
    status: 1,
}

const AddTenant = (props) => {

    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
    // ** Props
    const [radioValue, setRadioValue] = useState(1)
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)
    const { handleClose, handleDialogToggle, open, setTenantData, value } = props

    const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const handleRadioChange = event => {
        setRadioValue(event.target.value)
    }

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(getNextYearDate())
    const [error, setError] = useState(false)


    const onSubmit = async (data) => {
        try {
            if (!startDate || !endDate) {
                setError(true)
                return;
            }
            setShowSpinner(true);
            // let endDateToSend = add5_5HoursToDate(endDate);
            const allData = { ...data, startDate: startDate, endDate, status: radioValue, params: { q: value } };
            const response = await addTenant(allData, { q: value });
            setTenantData(response.data)
            if (response.success) {
                showSuccessToast("Tenant Saved Successfully.");
                reset();
                handleClose();
            } else {
                showErrorToast(response.message);
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
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Add Tenant
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>

                                        <Controller
                                            name='tenantName'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Tenant Name'
                                                    autoFocus
                                                    onChange={onChange}
                                                    error={Boolean(errors.tenantName)}
                                                />
                                            )}
                                        />
                                        {errors.tenantName && <FormHelperText sx={{ color: 'error.main' }}>{errors.tenantName.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>

                                        <Controller
                                            name='personName'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Person Name'
                                                    onChange={onChange}
                                                    error={Boolean(errors.personName)}
                                                />
                                            )}
                                        />
                                        {errors.personName && <FormHelperText sx={{ color: 'error.main' }}>{errors.personName.message}</FormHelperText>}
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
                                            multiline
                                            maxRows={6}
                                            onChange={onChange}
                                            error={Boolean(errors.address)}
                                        />
                                    )}
                                />
                                {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
                            </FormControl>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>

                                        <Controller
                                            name='contactNo'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Contact No'
                                                    onChange={onChange}
                                                    error={Boolean(errors.contactNo)}
                                                />
                                            )}
                                        />
                                        {errors.contactNo && <FormHelperText sx={{ color: 'error.main' }}>{errors.contactNo.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
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
                                                    error={Boolean(errors.email)}
                                                />
                                            )}
                                        />
                                        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <DatePickerWrapper>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                selected={startDate}
                                                id='basic-input'
                                                popperPlacement={popperPlacement}
                                                dateFormat='d-MMMM-yyyy'
                                                maxDate={new Date()}
                                                onChange={date => setStartDate(date)}
                                                placeholderText='Click to select a date'
                                                customInput={<CustomInput label='Start Date' error={error && !startDate} />}
                                            />
                                            {error && !startDate && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Start Date.</FormHelperText>}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <DatePicker
                                                selected={endDate}
                                                id='basic-input'
                                                popperPlacement={popperPlacement}
                                                dateFormat='d-MMMM-yyyy'
                                                onChange={date => setEndDate(date)}
                                                placeholderText='Click to select a date'
                                                minDate={startDate ? new Date(startDate.getTime()) : new Date()}
                                                customInput={<CustomInput label='End Date' error={error && !endDate} />}
                                            />
                                            {error && !endDate && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select End Date.</FormHelperText>}
                                        </Grid>
                                    </Grid>
                                </DatePickerWrapper>
                            </FormControl>
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
                                    <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} /></Typography>
                                    <Typography sx={{ color: "white" }}>Save</Typography>
                                </Button>
                                <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
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

export default AddTenant
