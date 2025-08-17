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
import * as yup from 'yup'

// ** Icon Imports

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addParentMenu } from 'src/api/utility/parentMenu'
import { LoadingContext } from 'src/pages/_app'
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
    name: yup.string().required("Menu Name is Required."),
    displayRank: yup.string().required("Display Rank is Required."),
})

const defaultValues = {
    name: '',
    displayRank: "",
    status: '',
}

const AddParentMenu = props => {
    // ** Props
    const [radioValue, setRadioValue] = useState(1)
    const { handleClose, handleDialogToggle, open, setParentData, value } = props
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
            const response = await addParentMenu(allData);
            setParentData(response.data)
            if (!response.success) {
                showErrorToast(response.message)
            } else {
                reset();
                handleClose();
                showSuccessToast("Parent Menu Saved Successfully.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };

    return (
        <>
            <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
                <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Add Parent Menu
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Menu Name'
                                            autoFocus
                                            onChange={onChange}
                                            error={Boolean(errors.name)}
                                        />
                                    )}
                                />
                                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <Controller
                                    name='displayRank'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Display Rank'
                                            type='number'
                                            onChange={(event) => !['e', 'E', '+', '-'].includes(event.key) && onChange(event)}
                                            error={Boolean(errors.displayRank)}
                                        />
                                    )}
                                />
                                {errors.displayRank && <FormHelperText sx={{ color: 'error.main' }}>{errors.displayRank.message}</FormHelperText>}
                            </FormControl>

                            <Grid container spacing={6} sx={{ mb: 5 }}>
                                <Grid item xs={12} sm={6}>
                                    <RadioGroup row aria-label='controlled' name='controlled' value={radioValue} onChange={handleRadioChange}>
                                        <FormControlLabel value={1} control={<Radio />} label='Active' />
                                        <FormControlLabel value={0} control={<Radio />} label='InActive' />
                                    </RadioGroup>
                                </Grid>
                            </Grid>
                            {/* {errors.status && <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>} */}
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

export default AddParentMenu
