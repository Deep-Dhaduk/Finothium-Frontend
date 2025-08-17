// ** React Imports
import { useContext, useEffect, useState } from 'react'

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
import { Autocomplete, Divider, Grid, Card, IconButton, Paper, Popper, Select, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addTransaction } from 'src/api/allTransaction/transaction'
import { LoadingContext } from 'src/pages/_app'
import { category, client, payment } from 'src/varibles/constant'
import { addIcon, cancelIcon, deleteIcon, saveIcon } from 'src/varibles/icons'
import { AppContext } from 'src/varibles/variable'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import Swal from 'sweetalert2'

const schema = yup.object().shape({
    amount: yup.string().required("Amount is Required."),
})

const defaultValues = {
    date: '',
    paymentType: '',
    transactionType: '',
    client_category_name: '',
    accountId: '',
    amount: '',
    description: '',
}

const AddPaymentTransaction = props => {
    const [formValues, setFormValues] = useState([{ subCategoryId: "", amount: '', description: "" }]);
    const { handleClose, handleDialogToggle, type, open, setTransactionData, activeAccount, activePaymentType, activeClient, activeSubCategory, filterData } = props

    // ** Props
    const [date, setDate] = useState(new Date())
    const [accountName, setAccountName] = useState('');
    const [clientName, setClientName] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [error, setError] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0);
    const { setShowSpinner } = useContext(LoadingContext)

    const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    let addFormFields = () => {
        setFormValues([...formValues, { subCategoryId: "", amount: '', description: '' }])
    }

    let removeFormFields = (i) => {
        const newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        newFormValues.length === 0 ? setFormValues([{ subCategoryId: "", amount: '', description: '' }]) : setFormValues(newFormValues)
    }

    const onSubmit = async (data) => {
        try {
            if (!accountName || !paymentType || !clientName) {
                setError(true);
            } else {
                if (Number(data.amount) !== totalAmt && totalAmt > 0) {
                    const result = await Swal.fire({
                        title: 'Are you sure?',
                        text: `The transaction amount of ₹ ${data.amount} does not match with the detail amount of ₹ ${totalAmt} Would you like to proceed and save anyway?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'No',
                        confirmButtonText: 'Yes',
                        confirmButtonColor: '#7066e0'
                    })

                    if (result.isConfirmed) {
                        setShowSpinner(true);
                        setError(false)
                        const details = formValues[0].subCategoryId === '' && formValues[0].amount === '' && formValues[0].description === '' ? [] : formValues;
                        const allData = { ...data, accountName, transactionType: type, clientName, paymentType: paymentType, date: date, details: details, filterData };
                        const response = await addTransaction(allData);
                        setTransactionData(response.data)

                        if (!response.success) {
                            showErrorToast(response.message);
                        } else {
                            reset();
                            handleClose();
                            showSuccessToast(`${type} Saved Successfully.`);
                        }

                    }
                } else {
                    setShowSpinner(true);
                    setError(false);
                    const details = formValues[0].subCategoryId === '' && formValues[0].amount === '' && formValues[0].description === '' ? [] : formValues;
                    const allData = { ...data, accountName, transactionType: type, clientName, paymentType: paymentType, date: date, details: details, filterData };
                    const response = await addTransaction(allData);
                    setTransactionData(response.data)

                    if (!response.success) {
                        showErrorToast(response.message);
                    } else {
                        reset();
                        handleClose();
                        showSuccessToast(`${type} Saved Successfully.`);
                    }

                }

            }

        } catch (error) {
            console.error("An error occurred synchronously:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };

    const handleAccountChange = (newValue) => {
        const selectedValue = newValue ? newValue.account_id : '';
        setAccountName(selectedValue);
    };

    const handleClientCategoryChange = (newValue) => {
        const selectedValue = newValue ? newValue.clientId : '';
        setClientName(selectedValue);
    };

    const handlePaymentChange = (newValue) => {
        const selectedValue = newValue ? newValue.common_id : '';
        setPaymentType(selectedValue);
    };

    const handleSubCategoryChange = (index, value) => {
        const subCateogeryId = value ? value.common_id : '';
        const updatedFormValues = [...formValues];
        updatedFormValues[index] = {
            ...updatedFormValues[index],
            subCategoryId: subCateogeryId
        };
        setFormValues(updatedFormValues);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFormValues = [...formValues];
        updatedFormValues[index] = {
            ...updatedFormValues[index],
            [name]: value
        };
        setFormValues(updatedFormValues);
        // calculateTotalAmount()
    }

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        formValues.forEach((item) => {
            totalAmount += Number(item.amount)
        })
        setTotalAmt(totalAmount);
    };

    useEffect(() => {
        calculateTotalAmount()
    }, [formValues])

    return (
        <>
            <Dialog fullWidth maxWidth='lg' onClose={handleDialogToggle} open={open}>
                <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Add {type} Transaction
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 4 }}>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={5}>
                            <Box sx={{ p: 2 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <DatePickerWrapper fullWidth sx={{ mb: 2, width: "100%" }}>
                                                <DatePicker
                                                    selected={date}
                                                    id='basic-input'
                                                    dateFormat='d-MMMM-yyyy'
                                                    popperPlacement={popperPlacement}
                                                    onChange={date => setDate(date)}
                                                    placeholderText='Click to select a date'
                                                    maxDate={new Date()}
                                                    customInput={<CustomInput label='Transaction Date' />}
                                                />
                                            </DatePickerWrapper>
                                        </Grid>
                                        <Grid item xs={12} sm={6} >
                                            <FormControl fullWidth sx={{ mb: 2 }}>
                                                <Autocomplete
                                                    fullWidth
                                                    value={activeAccount.find((item) => item.account_id === accountName) || null}
                                                    onChange={(event, newValue) => handleAccountChange(event, newValue)}
                                                    options={activeAccount}
                                                    getOptionLabel={(item) => item.account_name}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Account Name" variant="outlined" error={error && !accountName} autoFocus />
                                                    )}
                                                />
                                                {error && !accountName && <FormHelperText sx={{ color: 'error.main' }}>Please Select Account Name.</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth sx={{ mb: 2 }}>

                                                <Autocomplete
                                                    fullWidth
                                                    value={activePaymentType.find((item) => item.common_id === paymentType) || null}
                                                    onChange={(event, newValue) => handlePaymentChange(event, newValue)}
                                                    options={activePaymentType}
                                                    getOptionLabel={(item) => item.name}
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Select Payment Type" variant="outlined" error={error && !paymentType} />
                                                    )}
                                                />
                                                {error && !paymentType && <FormHelperText sx={{ color: 'error.main' }}>Please Select Payment Type.</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth sx={{ mb: 4 }}>
                                                <Controller
                                                    name='amount'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field: { value, onChange } }) => (
                                                        <TextField
                                                            value={value}
                                                            type='number'
                                                            label='Amount'
                                                            onChange={onChange}
                                                            placeholder=''
                                                            error={Boolean(errors.amount)}
                                                        />
                                                    )}
                                                />
                                                {errors.amount && <FormHelperText sx={{ color: 'error.main' }}>{errors.amount.message}</FormHelperText>}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Autocomplete
                                            fullWidth
                                            value={activeClient.find((item) => item.clientId === clientName) || null}
                                            onChange={(event, newValue) => handleClientCategoryChange(event, newValue)}
                                            options={activeClient}
                                            getOptionLabel={(item) => item.clientName}
                                            renderInput={(params) => (
                                                <TextField {...params} label={`Select ${type === payment ? category : client}`} variant="outlined" error={error && !clientName} />
                                            )}
                                            PopperComponent={({ children, anchorEl, ...props }) => (
                                                <Popper {...props} anchorEl={anchorEl} placement="bottom">
                                                    {children}
                                                </Popper>
                                            )}
                                        />
                                        {error && !clientName && <FormHelperText sx={{ color: 'error.main' }}>{`Please Select ${type === payment ? category : client}.`}</FormHelperText>}

                                    </FormControl>
                                    <FormControl fullWidth sx={{ mb: 6 }}>

                                        <Controller
                                            name='description'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    value={value}
                                                    label='Description'
                                                    multiline
                                                    maxRows={6}
                                                    onChange={onChange}
                                                    error={Boolean(errors.description)}
                                                />
                                            )}
                                        />
                                        {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
                                    </FormControl>
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
                        </Grid>
                        <Box sx={{ ml: 1 }}>
                            <Divider orientation="vertical" />
                        </Box>
                        <Box sx={{ mr: 3 }}>
                            <Divider orientation="vertical" />
                        </Box>
                        <Grid item xs={12} sm={12} md={6.6}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography>Total : {totalAmt.toFixed(2)}</Typography>
                                <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={addFormFields}>
                                    <Icon icon={addIcon} />
                                </Box>
                            </Box>
                            <div className='tableSize'>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table" size="small" sx={{ mt: 1 }}>
                                        <TableBody>
                                            {formValues.map((row, index) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{
                                                        '&:not(:last-child) td, &:not(:last-child) th': { borderBottom: 0 },
                                                        '&:last-child td, &:last-child th': { border: 0 }
                                                    }}
                                                >
                                                    <Card variant="outlined" sx={{ mb: 2, bgcolor: `${theme.palette.mode === 'dark' ? '#3e415c' : '#F7F7F9'}`, pl: 3 }} >
                                                        <Box sx={{ pt: `${formValues.length <= 1 && formValues[0].subCategoryId === '' ? '0.5rem' : '0rem'}` }}>
                                                            <TableCell>
                                                                <Grid container spacing={2} >

                                                                    <Grid item xs={12} sm={4} sx={{ mb: 2 }}>

                                                                        <Autocomplete
                                                                            size='small'
                                                                            sx={{ minWidth: '130px', width: { md: '96%', sm: '96%', xs: '96%' } }}
                                                                            value={activeSubCategory.find((item) => item.common_id === formValues[index].subCategoryId) || null}
                                                                            onChange={(event, newValue) => handleSubCategoryChange(index, newValue)}
                                                                            options={activeSubCategory}
                                                                            getOptionLabel={(item) => item.name}
                                                                            renderInput={(params) => (
                                                                                <TextField {...params} label="Sub Category" variant="outlined" />
                                                                            )}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={4} sx={{ mb: 2 }}>
                                                                        <TextField
                                                                            name='amount'
                                                                            type='number'
                                                                            size='small'
                                                                            sx={{ width: '96%' }}
                                                                            value={formValues[index].amount}
                                                                            label='Amount'
                                                                            onChange={e => handleChange(index, e)}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={4} sx={{ mb: 1 }}>
                                                                        <TextField
                                                                            name='description'
                                                                            type='text'
                                                                            multiline
                                                                            maxRows={2}
                                                                            sx={{ width: '96%' }}
                                                                            size='small'
                                                                            value={formValues[index].description}
                                                                            label='Description'
                                                                            onChange={e => handleChange(index, e)}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </TableCell>
                                                            <TableCell>
                                                                {formValues.length >= 2 || (formValues[0].amount !== '' || formValues[0].subCategoryId !== '' || formValues[0].description !== '') ?
                                                                    <IconButton sx={{ bgcolor: "#FF4D49", borderRadius: "5px", mt: 4, p: 1, mr: 2, cursor: "pointer", ":hover": { backgroundColor: "#FF4D49" }, color: "white" }} onClick={() => removeFormFields(index)}>
                                                                        <Icon icon={deleteIcon} />
                                                                    </IconButton> :
                                                                    <Box sx={{ paddingLeft: '40px' }}></Box>}
                                                            </TableCell>
                                                        </Box>
                                                    </Card>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog >
        </>
    )
}

export default AddPaymentTransaction
