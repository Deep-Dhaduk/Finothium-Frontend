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

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** Actions Imports
import { Autocomplete, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addChildMenu } from 'src/api/utility/childMenu'
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
    displayRank: '',
    childMenu: '',
    parentId: 0
}

const AddChildMenu = props => {
    // ** Props
    const [radioValue, setRadioValue] = useState(1)
    const [parentMenu, setParentMenu] = useState()
    const [error, setError] = useState(false);
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const { handleClose, handleDialogToggle, open, setChildData, activeParent, value } = props

    const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const handleRadioChange = event => {
        setRadioValue(event.target.value)
    }

    const handleParentMenuChange = (event, newValue) => {
        const selectedValue = newValue ? newValue.id : '';
        setParentMenu(selectedValue);
    };

    const onSubmit = async (data) => {
        try {
            if (!parentMenu) {
                setError(true)
            } else {
                setShowSpinner(true);
                setError(false)
                const allData = { ...data, parentId: parentMenu, status: radioValue, params: { q: value } };
                const response = await addChildMenu(allData);
                setChildData(response.data)
                if (response.success) {
                    reset();
                    handleClose();
                    showSuccessToast("Child Menu Saved Successfully.");
                } else {
                    showErrorToast(response.message)
                }
            }

        } catch (error) {
            console.error("An error occurred asynchronously:", error);
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
                        Add Child Menu
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                {/* <Autocomplete
                                    fullWidth
                                    value={activeParent.find((menu) => menu.id === parentMenu) || null}
                                    onChange={(event, newValue) => handleParentMenuChange(event, newValue)}
                                    options={activeParent}
                                    getOptionLabel={(option) => option.menu_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Parent Menu" variant="outlined" error={error && !parentMenu} autoFocus />
                                    )}
                                /> */}
                                <Autocomplete
                                    fullWidth
                                    value={(Array.isArray(activeParent) && activeParent.find((menu) => menu.id === parentMenu)) || null}
                                    onChange={(event, newValue) => handleParentMenuChange(event, newValue)}
                                    options={activeParent || []}
                                    getOptionLabel={(option) => option.menu_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Parent Menu" variant="outlined" error={error && !parentMenu} autoFocus />
                                    )}
                                />

                                {error && !parentMenu && <FormHelperText sx={{ color: 'error.main' }}>Please Select Parent Menu.</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 6 }}>

                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Menu Name'
                                            onChange={onChange}
                                            error={Boolean(errors.name)}
                                        />
                                    )}
                                />
                                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 6 }}>

                                <Controller
                                    name='displayRank'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label='Display Rank'
                                            type='number'
                                            onChange={onChange}
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

export default AddChildMenu
