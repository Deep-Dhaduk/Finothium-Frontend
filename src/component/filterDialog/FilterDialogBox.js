import { useTheme } from '@emotion/react'
import { Autocomplete, Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, Grid, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { showErrorToast } from 'src/allFunction/commonFunction'
import { fetchTransaction } from 'src/api/allTransaction/transaction'
import { fetchTransferData } from 'src/api/allTransaction/transfer'
import { filterGroupWiseData } from 'src/api/report/accountGroupReport'
import { filterAccountTypeWiseData } from 'src/api/report/accountTypeReport'
import { filterAccountWiseData } from 'src/api/report/accountWiseReport'
import { filterAnnuallyWiseData } from 'src/api/report/annuallyReport'
import { filterCategoryWiseData } from 'src/api/report/categoryReport'
import { filterClientWiseData } from 'src/api/report/clientReport'
import { filterCompanyWiseData } from 'src/api/report/companyReport'
import { filterMonthlyWiseData } from 'src/api/report/monthlyReport'
import { filterPaymentWiseData } from 'src/api/report/paymentTypeReport'
import { filterQuarterlyWiseData } from 'src/api/report/quarterlyReport'
import { filterSemiAnnualWiseData } from 'src/api/report/semiAnnualReport'
import { filterSubCategoryWiseData } from 'src/api/report/subCategoryReport'
import { DateRangeContext, LoadingContext } from 'src/pages/_app'
import { payment, receipt, transferTransaction } from 'src/varibles/constant'
import { cancelIcon, filterIcon, resetFilter } from 'src/varibles/icons'
import { AppContext, defaultFilterData } from 'src/varibles/variable'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

const defaultValues = {
    name: ""
}

const FilterDialogBox = (props) => {
    const { allIds, setAllIds } = useContext(AppContext)
    const { settingDate } = useContext(DateRangeContext)

    const { handleDialogToggle, open, accountReportData, categoryReportData, clientReportData, companyReportData, groupReportData, paymentReportData, accountTypeReportData, subCategoryReportData, quarterlyData, semiAnnualData, annuallyData, monthlyData, type, setReportData, setTransactionData, setTransferData, filterDropdownData, advanceFilterConfig } = props
    const { accountData, accountGroupData, accountTypeData, paymentTypeData, clientData, categoryData, subCategoryData } = filterDropdownData
    const [startDate, setStartDate] = useState(settingDate.fromDate)
    const [endDate, setEndDate] = useState(settingDate.toDate)
    const [paymentTypeIds, setPaymentTypeIds] = React.useState([]);
    const [subCategoryIds, setSubCategoryIds] = React.useState([]);
    const [clientTypeIds, setClientTypeIds] = React.useState([]);
    const [categoryTypeIds, setCategoryTypeIds] = React.useState([]);
    const [groupTypeIds, setGroupTypeIds] = React.useState([]);
    const [accountIds, setAccountIds] = React.useState([]);
    const [accountTypeIds, setAccountTypeIds] = React.useState([]);
    const [fromAmt, setFromAmt] = React.useState(null);
    const [toAmt, setToAmt] = React.useState(null);
    const { setShowSpinner } = useContext(LoadingContext)
    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    const handleClientCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.clientId);
        setClientTypeIds(selectedIds);
    };

    const handleAccountCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.account_id);
        setAccountIds(selectedIds);
    };

    const handleAccountTypeCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.common_id);
        setAccountTypeIds(selectedIds);
    };

    const handleCategoryCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.clientId);
        setCategoryTypeIds(selectedIds);
    };

    const handleCommonCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.common_id);
        setPaymentTypeIds(selectedIds);
    };
    const handleSubCategoryCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.common_id);
        setSubCategoryIds(selectedIds);
    };

    const handleGroupCheckBoxChange = (event, newValue) => {
        const selectedIds = newValue.map((option) => option.common_id);
        setGroupTypeIds(selectedIds);
    };

    const handleChangeFromAmt = (e) => {
        const selectFromAmount = (e.target.value ? Number(e.target.value) : null);
        setFromAmt(selectFromAmount)
    }

    const handleChangeToAmt = (e) => {
        const selectToAmount = (e.target.value ? Number(e.target.value) : null);
        setToAmt(selectToAmount)
    }

    const { handleSubmit } = useForm({ defaultValues, mode: 'onChange' })

    const idsSet = (allData) => {
        setAllIds({
            startDate: allData.startDate, endDate: allData.endDate, accountIds: allData.accountIds, groupTypeIds: allData.groupTypeIds, paymentTypeIds: allData.paymentTypeIds, categoryTypeIds: allData.categoryTypeIds, subCategoryIds: allData.subCategoryIds, clientTypeIds: allData.clientTypeIds, accountTypeIds: allData.accountTypeIds, fromAmt: allData.fromAmt, toAmt: allData.toAmt
        })
    }

    const handleSubmitAccount = async (allData) => {
        const response = await filterAccountWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }

    const handleSubmitCompany = async (allData) => {
        const response = await filterCompanyWiseData(allData)
        setReportData(response.data)
        idsSet(allData)

    }

    const handleSubmitPayment = async (allData) => {
        idsSet(allData)
        const response = await filterPaymentWiseData(allData)
        setReportData(response.data)

    }
    const handleSubmitGroup = async (allData) => {
        const response = await filterGroupWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }
    const handleSubmitCategory = async (allData) => {
        const response = await filterCategoryWiseData(allData)
        setReportData(response.data)
        idsSet(allData)

    }
    const handleSubmitSubCategory = async (allData) => {
        const response = await filterSubCategoryWiseData(allData)
        setReportData(response.data)
        idsSet(allData)

    }
    const handleSubmitClient = async (allData) => {
        const response = await filterClientWiseData(allData)
        setReportData(response.data)
        idsSet(allData)

    }
    const handleSubmitAccountType = async (allData) => {
        const response = await filterAccountTypeWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }
    const handleSubmitQuarterly = async (allData) => {
        const response = await filterQuarterlyWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }
    const handleSubmitSemiAnnual = async (allData) => {
        const response = await filterSemiAnnualWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }
    const handleSubmitAnnually = async (allData) => {
        const response = await filterAnnuallyWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }
    const handleSubmitMonthly = async (allData) => {
        const response = await filterMonthlyWiseData(allData)
        setReportData(response.data)
        idsSet(allData)
    }

    const handleSubmitTransaction = async (allData) => {
        const response = await fetchTransaction(allData)
        setTransactionData(response.data)
        idsSet(allData)
    }

    const handleSubmitTransfer = async (allData) => {
        const response = await fetchTransferData(allData)
        setTransferData(response.data)
        idsSet(allData)
    }

    const dataSubmit = (allData) => {
        { groupReportData && handleSubmitGroup(allData) }
        { paymentReportData && handleSubmitPayment(allData) }
        { accountReportData && handleSubmitAccount(allData) }
        { categoryReportData && handleSubmitCategory(allData) }
        { clientReportData && handleSubmitClient(allData) }
        { companyReportData && handleSubmitCompany(allData) }
        { accountTypeReportData && handleSubmitAccountType(allData) }
        { quarterlyData && handleSubmitQuarterly(allData) }
        { semiAnnualData && handleSubmitSemiAnnual(allData) }
        { annuallyData && handleSubmitAnnually(allData) }
        { monthlyData && handleSubmitMonthly(allData) }
        { subCategoryReportData && handleSubmitSubCategory(allData) }
        { (type === payment || type === receipt) ? handleSubmitTransaction(allData) : null }
        { type === transferTransaction && handleSubmitTransfer(allData) }
    }

    const onSubmit = () => {
        setShowSpinner(true)
        try {
            const allData = {
                startDate,
                endDate,
                paymentTypeIds: paymentTypeIds.length === 0 ? null : paymentTypeIds,
                accountIds: accountIds.length === 0 ? null : accountIds,
                categoryTypeIds: categoryTypeIds.length === 0 ? null : categoryTypeIds,
                subCategoryIds: subCategoryIds.length === 0 ? null : subCategoryIds,
                clientTypeIds: clientTypeIds.length === 0 ? null : clientTypeIds,
                groupTypeIds: groupTypeIds.length === 0 ? null : groupTypeIds,
                accountTypeIds: accountTypeIds.length === 0 ? null : accountTypeIds,
                type,
                fromAmt,
                toAmt
            }
            dataSubmit(allData);
            handleDialogToggle()
        } catch (error) {
            console.error('Error in onSubmit:', error);
            showErrorToast("An error occurred. Please try again.");
        } finally {
            setTimeout(() => {
                setShowSpinner(false);
            }, 500);
        }
    }

    // const resetField = () => {
    //     setStartDate(settingDate.fromDate);
    //     setEndDate(settingDate.toDate);
    //     setAccountIds([]);
    //     setGroupTypeIds([]);
    //     setClientTypeIds([]);
    //     setCategoryTypeIds([]);
    //     setPaymentTypeIds([]);
    //     setSubCategoryIds([]);
    //     setAccountTypeIds([]);
    //     setFromAmt(null);
    //     setToAmt(null);
    // }

    const resetFormFields = () => {
        try {
            setShowSpinner(true);
            //resetField();
            let allData = {
                ...defaultFilterData,
                startDate: settingDate.fromDate,
                endDate: settingDate.toDate,
                type,
                fromAmt: null,
                toAmt: null
            }
            allData = {
                ...allData,
                paymentTypeIds: allData.paymentTypeIds?.length === 0 ? null : allData.paymentTypeIds,
                accountIds: allData.accountIds?.length === 0 ? null : allData.accountIds,
                categoryTypeIds: allData.categoryTypeIds?.length === 0 ? null : allData.categoryTypeIds,
                subCategoryIds: allData.subCategoryIds?.length === 0 ? null : allData.subCategoryIds,
                clientTypeIds: allData.clientTypeIds?.length === 0 ? null : allData.clientTypeIds,
                groupTypeIds: allData.groupTypeIds?.length === 0 ? null : allData.groupTypeIds,
                accountTypeIds: allData.accountTypeIds?.length === 0 ? null : allData.accountTypeIds,
            }
            dataSubmit(allData);
            handleDialogToggle()

        } catch (error) {
            console.error('Error in onSubmit:', error);
            showErrorToast("An error occurred. Please try again.");
        } finally {
            setShowSpinner(false);
        }
    };

    useEffect(() => {
        setAccountIds(allIds.accountIds === null ? [] : allIds.accountIds);
        setGroupTypeIds(allIds.groupTypeIds === null ? [] : allIds.groupTypeIds)
        setClientTypeIds(allIds.clientTypeIds === null ? [] : allIds.clientTypeIds)
        setCategoryTypeIds(allIds.categoryTypeIds === null ? [] : allIds.categoryTypeIds)
        setPaymentTypeIds(allIds.paymentTypeIds === null ? [] : allIds.paymentTypeIds)
        setAccountTypeIds(allIds.accountTypeIds === null ? [] : allIds.accountTypeIds)
        setSubCategoryIds(allIds.subCategoryIds === null ? [] : allIds.subCategoryIds)
        setStartDate(allIds.startDate);
        setEndDate(allIds.endDate);
        setFromAmt(allIds.fromAmt)
        setToAmt(allIds.toAmt)

    }, [open])

    return (
        <Dialog fullWidth maxWidth='md' onClose={handleDialogToggle} open={open}>
            <DatePickerWrapper>
                <DialogTitle sx={{ pt: 6, mx: 'auto', textAlign: 'center' }}>
                    <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                        Advance Filter
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pb: 6 }}>
                    <Box sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        {advanceFilterConfig.showFromDate && <DatePicker
                                            selected={startDate}
                                            id='basic-input'
                                            dateFormat='dd-MMMM-yyyy'
                                            popperPlacement={popperPlacement}
                                            onChange={date => setStartDate(date)}
                                            placeholderText='Click to select a date'
                                            customInput={<CustomInput label='From Date' />}
                                        />}
                                    </Grid>

                                    <Grid item xs={12} sm={6} sx={{ mt: { xs: 2, sm: 0 } }} >
                                        {advanceFilterConfig.showToDate && <DatePicker
                                            selected={endDate}
                                            id='basic-input'
                                            dateFormat='dd-MMMM-yyyy'
                                            popperPlacement={popperPlacement}
                                            onChange={date => setEndDate(date)}
                                            placeholderText='Click to select a date'
                                            customInput={<CustomInput label='To Date' />}
                                        />}
                                    </Grid>
                                </Grid>
                            </FormControl>

                            <Grid container spacing={2}>
                                {advanceFilterConfig.showAccountGroupName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={accountGroupData.filter((group) => groupTypeIds.includes(group.common_id))}
                                            onChange={(event, newValue) => handleGroupCheckBoxChange(event, newValue)}
                                            options={accountGroupData}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Account Group Name" variant="outlined" />
                                            )}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} />
                                                    {option.name}
                                                </li>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showAccountName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={accountData.filter((account) => accountIds.includes(account.account_id))}
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
                                </Grid>}
                                {advanceFilterConfig.showAccountTypeName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={accountTypeData.filter((group) => accountTypeIds.includes(group.common_id))}
                                            onChange={(event, newValue) => handleAccountTypeCheckBoxChange(event, newValue)}
                                            options={accountTypeData}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Account Type Name" variant="outlined" />
                                            )}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} />
                                                    {option.name}
                                                </li>
                                            )}
                                        />

                                        {/* {errors.company && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>} */}
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showPaymentTypeName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={paymentTypeData.filter((group) => paymentTypeIds.includes(group.common_id))}
                                            onChange={(event, newValue) => handleCommonCheckBoxChange(event, newValue)}
                                            options={paymentTypeData}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Payment Type Name" variant="outlined" />
                                            )}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} />
                                                    {option.name}
                                                </li>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showClientName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={clientData.filter((cat) => clientTypeIds.includes(cat.clientId))}
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
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showCategoryName && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={categoryData.filter((cat) => categoryTypeIds.includes(cat.clientId))}
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
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showSubCategory && <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            id="demo-multiple-checkbox"
                                            value={subCategoryData.filter((group) => subCategoryIds.includes(group.common_id))}
                                            onChange={(event, newValue) => handleSubCategoryCheckBoxChange(event, newValue)}
                                            options={subCategoryData}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Sub Category Name" variant="outlined" />
                                            )}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} />
                                                    {option.name}
                                                </li>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>}
                                {advanceFilterConfig.showFromAmount && <Grid item xs={12} sm={6}>
                                    <TextField
                                        name='amount'
                                        fullWidth
                                        type='number'
                                        value={fromAmt}
                                        label='From Amount'
                                        sx={{ mr: [0, 4], mb: [2, 0] }}
                                        onChange={handleChangeFromAmt}
                                    />
                                </Grid>}
                                {advanceFilterConfig.showToAmount && <Grid item xs={12} sm={6}>
                                    <TextField
                                        name='amount'
                                        fullWidth
                                        type='number'
                                        value={toAmt}
                                        label='To Amount'
                                        sx={{ mr: [0, 4], mb: [3, 0] }}
                                        onChange={handleChangeToAmt}
                                    />
                                </Grid>}

                            </Grid>

                            <Box sx={{ display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'space-between', mt: 5 }}>
                                <Box sx={{ display: "flex" }}>
                                    <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                        <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={filterIcon} fontSize={20} /></Typography>
                                        <Typography sx={{ color: "white" }}>Filter</Typography>
                                    </Button>
                                    <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleDialogToggle}>
                                        <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                                        <Typography>Cancel</Typography>
                                    </Button>
                                </Box>
                                <Box>
                                    <Button size='large' variant='contained' sx={{
                                        display: 'flex', alignItems: "center", backgroundColor: 'error.main',
                                        '&:hover': {
                                            backgroundColor: 'error.light'
                                        }
                                    }} onClick={resetFormFields}>
                                        <Typography sx={{ display: 'flex' }}> <Icon icon={resetFilter} fontSize={20} /> </Typography>
                                        <Typography sx={{ marginLeft: "8px" }}>Reset</Typography>
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>

                </DialogContent>
            </DatePickerWrapper>
        </Dialog>
    )
}

export default FilterDialogBox