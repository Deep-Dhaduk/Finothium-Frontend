import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, RadioGroup, Select, Typography, TextField, OutlinedInput, Checkbox, ListItemText, Chip, Autocomplete } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { cancelIcon, filterIcon, saveIcon } from 'src/varibles/icons'
import yup from 'yup'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { addDays } from 'date-fns'
import { useTheme } from '@emotion/react'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { subMonths } from 'date-fns'
import { fetchPaymentWiseData, filterPaymentWiseData } from 'src/store/report/paymentWiseStatement'
import { filterAccountWiseData } from 'src/store/report/accountWiseStatement'
import { filterCategoryWiseData } from 'src/store/report/CategoryWiseStatement'
import { filterClientWiseData } from 'src/store/report/clientWiseStatement'
import { fetchAccountData } from 'src/store/master/account'
import { fetchCommonData } from 'src/store/master/common'
import { fetchTransactionData } from 'src/store/transaction/transaction'
import { AppContext } from 'src/varibles/variable'


const defaultValues = {
    name: ''
}

const FilterDialogBox = (props) => {
    const { handleClose, handleDialogToggle, open, categoryData, clientData, type } = props
    const { paymentAccountId, setPaymentAccountId, paymentTypeId, setPaymentTypeId, paymentClientId, setPaymentClientId, paymentStartDate, setPaymentStartDate, paymentEndDate, setPaymentEndDate } = useContext(AppContext)
    const [startDate, setStartDate] = useState(subMonths(new Date(), 1))
    const [endDate, setEndDate] = useState((new Date()))
    const [ids, setIds] = React.useState([]);
    const [paymentIds, setPaymentIds] = React.useState([]);
    const [accountIds, setAccountIds] = React.useState([]);


    const storeAccount = useSelector(state => state.account)
    const accountData = storeAccount.data.filter(item => item.status === 1)
    const storeCommon = useSelector(state => state.common)
    const paymentTypeData = storeCommon.data.filter(item => item.type === 'Payment Type' && item.status === 1)

    const dispatch = useDispatch()
    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    const handleAccountCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.account_id);
        setAccountIds(selectedIds);
    };

    const handleCategoryCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.clientId);
        setIds(selectedIds);
    };

    const handleClientCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.clientId);
        setIds(selectedIds);
    };

    const handlePaymentCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.common_id);
        setPaymentIds(selectedIds);
    };

    const { handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange' })

    const onSubmit = () => {
        const allData = { startDate, endDate, type, ids, accountIds, paymentIds }
        dispatch(fetchTransactionData(allData))
        setPaymentAccountId(accountIds)
        setPaymentTypeId(paymentIds)
        setPaymentClientId(ids)
        setPaymentStartDate(startDate)
        setPaymentEndDate(endDate)
        handleDialogToggle()
    }

    useEffect(() => {
        dispatch(fetchAccountData())
        dispatch(fetchCommonData())
    }, [])

    useEffect(() => {
        switch (true) {
            case !!categoryData:
                setIds(paymentClientId);
                setAccountIds(paymentAccountId)
                setPaymentIds(paymentTypeId)
                setStartDate(paymentStartDate);
                setEndDate(paymentEndDate);
                break;
            case !!clientData:
                setIds(paymentClientId);
                setAccountIds(paymentAccountId)
                setPaymentIds(paymentTypeId)
                setStartDate(paymentStartDate);
                setEndDate(paymentEndDate);
                break;
            default:
                // Handle default case if needed
                break;
        }
    }, [open]);

    return (
        <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
            <DatePickerWrapper>
                <DialogTitle sx={{ pt: 6, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Advance Filter
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 6 }}>

                    <Box sx={{ p: 5 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {categoryData && <FormControl fullWidth sx={{ mb: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="demo-multiple-checkbox"
                                    value={categoryData.filter((cat) => ids.includes(cat.clientId))}
                                    onChange={(event, newValue) => handleCategoryCheckBoxChange(event, newValue)}
                                    options={categoryData}
                                    getOptionLabel={(option) => option.clientName}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Category Name" variant="outlined" />
                                    )}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} />
                                            {option.clientName}
                                        </li>
                                    )}
                                />
                                {/* {errors.company && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>} */}
                            </FormControl>}
                            {clientData && <FormControl fullWidth sx={{ mb: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="demo-multiple-checkbox"
                                    value={clientData.filter((cat) => ids.includes(cat.clientId))}
                                    onChange={(event, newValue) => handleClientCheckBoxChange(event, newValue)}
                                    options={clientData}
                                    getOptionLabel={(option) => option.clientName}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Client Name" variant="outlined" />
                                    )}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} />
                                            {option.clientName}
                                        </li>
                                    )}
                                />
                                {/* {errors.company && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>} */}
                            </FormControl>}
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="demo-multiple-checkbox"
                                    value={paymentTypeData.filter((cat) => paymentIds.includes(cat.common_id))}
                                    onChange={(event, newValue) => handlePaymentCheckBoxChange(event, newValue)}
                                    options={paymentTypeData}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Payment Type" variant="outlined" />
                                    )}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} />
                                            {option.name}
                                        </li>
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    id="demo-multiple-checkbox"
                                    value={accountData.filter((cat) => accountIds.includes(cat.account_id))}
                                    onChange={(event, newValue) => handleAccountCheckBoxChange(event, newValue)}
                                    options={accountData}
                                    getOptionLabel={(option) => option.account_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Account Name" variant="outlined" />
                                    )}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox checked={selected} />
                                            {option.account_name}
                                        </li>
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <DatePicker
                                            selected={startDate}
                                            id='basic-input'
                                            dateFormat='dd-MMMM-yyyy'
                                            popperPlacement={popperPlacement}
                                            onChange={date => setStartDate(date)}
                                            placeholderText='Click to select a date'
                                            customInput={<CustomInput label='From Date' />}
                                        />
                                    </Box>
                                    <Box>
                                        <DatePicker
                                            selected={endDate}
                                            id='basic-input'
                                            dateFormat='dd-MMMM-yyyy'
                                            popperPlacement={popperPlacement}
                                            onChange={date => setEndDate(date)}
                                            placeholderText='Click to select a date'
                                            customInput={<CustomInput label='To Date' />}
                                        />
                                    </Box>
                                </Box>
                            </FormControl>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}><Icon icon={filterIcon} /></Typography>
                                    <Typography>Filter</Typography>
                                </Button>
                                <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
                                    <Typography>Cancel</Typography>
                                </Button>
                            </Box>
                        </form>
                    </Box>

                </DialogContent>
            </DatePickerWrapper>
        </Dialog>
    )
}

export default FilterDialogBox