import { yupResolver } from '@hookform/resolvers/yup'
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addClient, } from 'src/api/master/clientMaster'
import { LoadingContext } from 'src/pages/_app'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import * as yup from 'yup'


const AddClient = (props) => {

    const { handleClose, open, type, setClientData, value } = props
    const [radioValue, setRadioValue] = useState(1)
    const [typeData, setTypeData] = useState(type)

    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const schema = yup.object().shape({
        name: yup.string().required(`${type} Name is Required.`),
    })


    const defaultValues = {
        name: '',
        type: type,
        status: '',
    }
    const dispatch = useDispatch();

    const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const handleRadioChange = event => {
        setRadioValue(event.target.value)
    }
    const handleTypeChange = event => {
        setTypeData(event.target.value)
    }

    const onSubmit = async (data) => {
        try {
            setShowSpinner(true)
            const allData = { ...data, status: radioValue, type: typeData, params: { q: value } };
            const response = await addClient(allData, type);
            setClientData(response.data)

            if (!response.success) {
                showErrorToast(response.message);
            } else {
                reset();
                handleClose();
                showSuccessToast(`${type} Saved Successfully.`);
            }
        } catch (error) {
            console.error("An error occurred asynchronously:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    }

    return (
        <>
            <Dialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
                <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        {`Add ${type}`}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            value={value}
                                            label={`${type} Name`}
                                            autoFocus
                                            onChange={onChange}
                                            error={Boolean(errors.name)}
                                        />
                                    )}
                                />
                                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                            </FormControl>
                            <Grid container spacing={6} sx={{ mb: 5 }}>
                                <Grid item xs={12} sm={12}>
                                    <RadioGroup row aria-label='controlled' name='controlled' value={typeData} onChange={handleTypeChange}>
                                        <FormControlLabel value={'both'} control={<Radio />} label='Both (Client & Cateogry)' />
                                        <FormControlLabel value={type} control={<Radio />} label={`${type} Only`} />
                                    </RadioGroup>
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


export default AddClient