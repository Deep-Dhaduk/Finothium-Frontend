import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Paper, Table, TableBody, TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  AppTooltip,
  CustomNoRowsOverlay,
  add5_5HoursToDate,
  formatDate,
  formatDateTime,
  getAllFilterData,
  showErrorToast,
  showSuccessToast
} from 'src/allFunction/commonFunction'
import { fetchActiveAccountData } from 'src/api/active/accountActive'
import { fetchActiveClientData } from 'src/api/active/clientActive'
import { fetchActiveCommonData } from 'src/api/active/commonActive'
import {
  addTransaction,
  deleteTransaction,
  fetchTransaction,
  updateTransaction
} from 'src/api/allTransaction/transaction'
import DarkCopyButton from 'src/component/copyButton/DarkCopyButton'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { DateRangeContext, LoadingContext } from 'src/pages/_app'
import { client, paymentType, receipt, subCategory } from 'src/varibles/constant'
import { addIcon, cancelIcon, deleteIcon, helpIcon, rupeeSymbol, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { AppContext, advanceFilter, defaultFilterData, defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import TableHeader from 'src/views/transaction/payment-receipt-transaction/TableHeader'
import Swal from 'sweetalert2'


const ReceiptTransaction = () => {
  const { settingDate, setSettingDate } = useContext(DateRangeContext)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'



  const defaultColumns = [
    {
      flex: 0.25,
      field: 'transaction_date',
      minWidth: 150,
      headerName: 'Date',
      renderCell: ({ row }) => {
        const formattedDate = formatDate(row.transaction_date)
        return <Typography variant='paragraph'>{formattedDate}</Typography>
      }
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'payment_type_name',
      headerName: 'Payment Type',
      renderCell: ({ row }) => <Typography variant='paragraph'>{row.payment_type_name}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'client_name',
      headerName: 'Client Name',
      renderCell: ({ row }) => <Typography variant='paragraph'>{row.client_name}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 100,
      field: 'account_name',
      headerName: 'Account Name',
      renderCell: ({ row }) => <Typography variant='paragraph'>{row.account_name}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 80,
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }) => (
        <Grid container>
          <Grid item xs={11} sm={11}>
            <Typography variant='paragraph' sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}>
              <Icon icon={rupeeSymbol} fontSize={16} />
              {Number(row.amount)}

            </Typography>
          </Grid>
          <Grid item xs={1} sm={1}>
            {row.details.length > 0 && <AppTooltip title="This entry contains Transaction Details." placement="top">
              <Typography variant='paragraph' sx={{ pl: 2, pt: 1.2 }}>
                <Icon icon={helpIcon} fontSize={16} color={'#8d96a8'} />
              </Typography>
            </AppTooltip>}
          </Grid>

        </Grid>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }) => <Typography variant='paragraph'>{row.description}</Typography>
    },
    {
      flex: 0.25,
      minWidth: 150,
      field: 'updatedOn',
      headerName: 'Updated',
      // sortable: false,
      renderCell: ({ row }) => {
        const utcDate = formatDateTime(row.updatedOn)
        return <Typography variant='paragraph'>{utcDate}</Typography>
      }
    }
  ]

  const location = useRouter()
  const [titleName, setTitleName] = useState('')
  const [formValues, setFormValues] = useState([{ subCategoryId: "", amount: '', description: "" }]);
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState({
    date: '',
    paymentType: '',
    clientName: '',
    accountName: '',
    amount: 0,
    description: '',
    details: []
  })
  const [value, setValue] = useState()
  const [allIds, setAllIds] = useState({
    ...defaultFilterData,
    startDate: settingDate.fromDate,
    endDate: settingDate.toDate
  })
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [error, setError] = useState(false)
  const [totalAmt, setTotalAmt] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [transactionData, setTransactionData] = useState([])
  const [activeAccount, setActiveAccount] = useState([])
  const [activePaymentType, setActivePaymentType] = useState([])
  const [activeClient, setActiveClient] = useState([])
  const [activeSubCategory, setActiveSubCategpry] = useState([])
  const [filterDropdownData, setFilterDropdownData] = useState({})
  const [advanceFilterConfig, setAdvanceFilterConfig] = useState(advanceFilter)
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const getRowId = row => row.transactionId

  const type = receipt

  let filterData = {
    startDate: allIds.startDate,
    endDate: allIds.endDate,
    paymentTypeIds: allIds.paymentTypeIds?.length === 0 ? null : allIds.paymentTypeIds,
    accountIds: allIds.accountIds?.length === 0 ? null : allIds.accountIds,
    clientTypeIds: allIds.clientTypeIds?.length === 0 ? null : allIds.clientTypeIds,
    categoryTypeIds: allIds.categoryTypeIds?.length === 0 ? null : allIds.categoryTypeIds,
    groupTypeIds: allIds.groupTypeIds?.length === 0 ? null : allIds.groupTypeIds,
    accountTypeIds: allIds.accountTypeIds?.length === 0 ? null : allIds.accountTypeIds,
    type,
    limit: null,
    fromAmount: null,
    toAmount: null,
    params: { q: value }
  }


  const handleChange = e => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
  }

  const handlePaymentChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.common_id : ''
    setEditValue(prevValue => ({
      ...prevValue,
      paymentType: selectedValue
    }))
  }

  const handleAccountChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.account_id : ''
    setEditValue(prevValue => ({
      ...prevValue,
      accountName: selectedValue
    }))
  }
  const handleClientChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.clientId : ''
    setEditValue(prevValue => ({
      ...prevValue,
      clientName: selectedValue
    }))
  }

  const handleEditData = row => {
    const adjustedDate = add5_5HoursToDate(new Date(row.transaction_date))
    setIsEdit(true)
    setEditValue({
      id: row.transactionId,
      date: adjustedDate,
      transactionType: row.transaction_type,
      paymentType: row.payment_type_Id,
      clientName: row.clientId,
      accountName: row.accountId,
      amount: row.amount,
      description: row.description,
      details: row.details
    })
    { row.details.length != 0 ? setFormValues(row.details) : setFormValues([{ subCategoryId: '', amount: '', description: '' }]); }


    setEditDialogOpen(true)
  }

  const handleCopyData = row => {
    setEditDialogOpen(true)
    setIsEdit(false)
    const adjustedDate = add5_5HoursToDate(new Date(row.transaction_date))
    setEditValue({
      id: null,
      date: adjustedDate,
      transactionType: row.transaction_type,
      paymentType: row.payment_type_Id,
      clientName: row.clientId,
      accountName: row.accountId,
      amount: row.amount,
      description: row.description
    })
    { row.details.length != 0 ? setFormValues(row.details) : setFormValues([{ subCategoryId: '', amount: '', description: '' }]); }

  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const dataTosubmit = async () => {
    setShowSpinner(true)
    setError(false);
    const editedDetails = formValues[0].subCategoryId === '' && formValues[0].amount === '' && formValues[0].description === ''
      ? []  // If conditions met, pass an empty array
      : formValues.map(detail => ({
        id: isEdit && detail.id !== undefined ? detail.id : null,
        subCategoryId: detail.subCategoryId,
        amount: detail.amount,
        description: detail.description
      }));
    const updatedEditValue = { ...editValue, details: editedDetails };
    const allData = { ...updatedEditValue, filterData };
    const response = isEdit ? await updateTransaction(allData) : await addTransaction(allData)
    setTransactionData(response.data)
    if (!response.success) {
      showErrorToast(response.message)
    } else {
      showSuccessToast(`Payment ${isEdit ? 'Updated' : 'Added'} Successfully.`)
      handleCloseEditDialog();
    }
  }

  const onSubmit = async e => {
    try {
      e.preventDefault()
      if (
        !editValue.clientName ||
        !editValue.amount ||
        !editValue.accountName ||
        !editValue.paymentType ||
        !editValue.date
      ) {
        setError(true)
        return
      }

      if (Number(editValue.amount) !== totalAmt && totalAmt > 0) {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: `The transaction amount of Rs.${editValue.amount} does not match with the detail amount of Rs.${totalAmt.toFixed(2)} Would you like to proceed and save anyway?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'No',
          confirmButtonText: 'Yes',
          confirmButtonColor: '#7066e0'
        })

        if (result.isConfirmed) {
          setShowSpinner(true)
          dataTosubmit()
        }
      }
      else {
        dataTosubmit()
      }
    } catch (error) {
      console.error('An error occurred asynchronously:', error)
      showErrorToast('An unexpected error occurred. Please try again later.')
    } finally {
      setShowSpinner(false)
    }
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
  }

  const handleDateChange = date => {
    setEditValue({ ...editValue, date: date })
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleDelete = async id => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#7066e0'
      })

      if (result.isConfirmed) {
        setShowSpinner(true)
        const allData = { filterData, id }

        const response = await deleteTransaction(allData)
        setTransactionData(response.data)
        if (!response.success) {
          showErrorToast(response.message)
        } else {
          showSuccessToast('Receipt Deleted Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      showErrorToast('An error occurred while deleting the receipt.')
    } finally {
      setShowSpinner(false)
    }
  }


  const columns = [
    {
      flex: 0.15,
      minWidth: 150,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DarkEditButton handleEditData={handleEditData} row={row} titleName={titleName} />
          <DarkDeleteButton handleDelete={handleDelete} id={row.transactionId} titleName={titleName} />
          <DarkCopyButton handleCopyData={handleCopyData} row={row} title='Copy' titleName={titleName} />
        </Box>
      )
    },

    ...defaultColumns
  ].map(column => {
    if (column.field === 'description') {
      return {
        ...column,
        renderCell: params =>
          <AppTooltip placement='top' title={params.row.description}>
            <Typography variant='paragraph'>{params.row.description}</Typography>
          </AppTooltip>
      }
    }
    return column
  })

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    formValues.forEach((item) => {
      totalAmount += Number(item.amount)
    })
    setTotalAmt(totalAmount);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { subCategoryId: "", amount: '', description: '' }])

  }

  let removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    newFormValues.length === 0 ? setFormValues([{ subCategoryId: "", amount: '', description: '' }]) : setFormValues(newFormValues)
  }

  const handleSubCategoryChange = (index, value) => {
    const subCateogeryId = value ? value.common_id : '';
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = {
      ...updatedFormValues[index],
      subCategoryId: subCateogeryId
    };
    setFormValues(updatedFormValues);
  };

  const handleFormValueChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = {
      ...updatedFormValues[index],
      [name]: value
    };
    setFormValues(updatedFormValues);
  }

  const fetchActiveAccount = async () => {
    const response = await fetchActiveAccountData()
    setActiveAccount(response.data)
  }
  const fetchActivePaymentType = async () => {
    const response = await fetchActiveCommonData({ type: paymentType })
    setActivePaymentType(response.data)
  }
  const fetchActiveClient = async () => {
    const response = await fetchActiveClientData({ type: client })
    setActiveClient(response.data)
  }

  const fetchActiveSubCategory = async () => {
    const response = await fetchActiveCommonData({ type: subCategory })
    setActiveSubCategpry(response.data)
  }

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchTransaction(filterData)
      setTransactionData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    } finally {
      setShowSpinner(false)
    }
  }

  const fetchFilterData = async () => {
    try {
      setShowSpinner(true)
      const response = await getAllFilterData()
      setFilterDropdownData(response)
    } catch (error) {
      console.error(`Error fetching filter data:`, error)
    } finally {
      setShowSpinner(false)
    }
  }

  const fetchSearchFilterData = async () => {
    try {
      const response = await fetchTransaction(filterData)
      setTransactionData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    }
  }

  useEffect(() => {
    calculateTotalAmount()
  }, [formValues])

  useEffect(() => {
    setAdvanceFilterConfig({
      ...advanceFilter,
      showFromDate: true,
      showToDate: true,
      showAccountGroupName: true,
      showAccountName: true,
      showAccountTypeName: true,
      showPaymentTypeName: true,
      showClientName: true,
      showCategoryName: true,
      showFromAmount: true,
      showToAmount: true
    })
    fetchActiveAccount()
    fetchActivePaymentType()
    fetchActiveClient()
    fetchActiveSubCategory()
    const navSetting = navAllChildren.find(x => x.path === location.pathname)
    const title = navSetting.title ?? ''
    setTitleName(title)
  }, [])

  useEffect(() => {
    filterData = { ...filterData, startDate: settingDate.fromDate, endDate: settingDate.toDate }
    setAllIds({ ...allIds, startDate: settingDate.fromDate, endDate: settingDate.toDate })
    fetchData()
    fetchFilterData()
  }, [settingDate])

  useEffect(() => {
    fetchSearchFilterData()
  }, [value])

  return (
    <>
      <AppContext.Provider value={{ allIds, setAllIds }}>
        <>
          <Grid container spacing={6}>
            <Grid item xs={12} className='module-heading'>
              <PageHeader title={<Typography variant='h6'>{titleName}</Typography>} />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <TableHeader
                  value={value}
                  filename={'receiptData'}
                  handleFilter={handleFilter}
                  type={type}
                  clientData={activeClient}
                  titleName={titleName}
                  filterData={filterData}
                  transactionData={transactionData}
                  setTransactionData={setTransactionData}
                  filterDropdownData={filterDropdownData}
                  advanceFilterConfig={advanceFilterConfig}
                  activeAccount={activeAccount}
                  activePaymentType={activePaymentType}
                  activeClient={activeClient}
                  activeSubCategory={activeSubCategory}
                />
                <div className='menu-item-hide'>
                  <DataGrid
                    autoHeight
                    rows={transactionData}
                    columns={columns}
                    pageSize={pageSize}
                    getRowId={getRowId}
                    disableSelectionOnClick
                    rowsPerPageOptions={pageSizeLength}
                    onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                    components={{
                      NoRowsOverlay: CustomNoRowsOverlay
                    }}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                  />
                </div>
              </Card>
            </Grid>
          </Grid>
          <Dialog maxWidth='lg' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
            <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
              <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                {isEdit ? 'Edit' : 'Add'} Receipt Transaction
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pb: 4 }}>
              <Grid container>
                <Grid item xs={12} sm={12} md={5}>
                  <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePickerWrapper fullWidth sx={{ mb: 2 }}>
                          <DatePicker
                            selected={editValue.date}
                            id='basic-input'
                            dateFormat='dd-MMMM-yyyy'
                            popperPlacement={popperPlacement}
                            onChange={date => handleDateChange(date)}
                            placeholderText='Click to select a date'
                            customInput={<CustomInput label='Transaction Date' error={error && !editValue.date} />}
                          />
                          {error && !editValue.date && (
                            <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}>
                              Please Select Transaction Date.
                            </FormHelperText>
                          )}
                        </DatePickerWrapper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                          <Autocomplete
                            fullWidth
                            value={activeAccount.find(item => item.account_id === editValue.accountName)}
                            onChange={(event, newValue) => handleAccountChange(event, newValue)}
                            options={activeAccount}
                            getOptionLabel={item => item.account_name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select Account Name'
                                variant='outlined'
                                error={error && !editValue.accountName}
                              />
                            )}
                          />
                          {error && !editValue.accountName && (
                            <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}>
                              Account Name is Required.
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                    {error && !editValue.accountName && (
                      <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}></FormHelperText>
                    )}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <Autocomplete
                            fullWidth
                            value={activePaymentType.find(item => item.common_id === editValue.paymentType) || null}
                            onChange={(event, newValue) => handlePaymentChange(event, newValue)}
                            options={activePaymentType}
                            getOptionLabel={item => item.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                label='Select Payment Type'
                                variant='outlined'
                                error={error && !editValue.paymentType}
                              />
                            )}
                          />
                          {error && !editValue.paymentType && (
                            <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}>
                              Payment Type is Required.
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 4 }}>
                          <TextField
                            name='amount'
                            type='number'
                            fullWidth
                            value={editValue.amount}
                            label='Amount'
                            // sx={{ mr: [0, 4], mb: [3, 0] }}
                            onChange={handleChange}
                            error={error && !editValue.amount}
                          />
                          {error && !editValue.amount && (
                            <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}>
                              Amount is Required.
                            </FormHelperText>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Autocomplete
                        fullWidth
                        value={activeClient.find(item => item.clientId === editValue.clientName) || null}
                        onChange={(event, newValue) => handleClientChange(event, newValue)}
                        options={activeClient}
                        getOptionLabel={item => item.clientName}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label='Select Client Name'
                            variant='outlined'
                            error={error && !editValue.clientName}
                          />
                        )}
                      />
                      {error && !editValue.clientName && (
                        <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}>
                          Client Name is Required.
                        </FormHelperText>
                      )}
                    </FormControl>

                    <Box sx={{ mb: 4 }}>
                      <TextField
                        name='description'
                        fullWidth
                        multiline
                        maxRows={6}
                        value={editValue.description}
                        label='Description'
                        // sx={{ mr: [0, 4], mb: [3, 0] }}
                        onChange={handleChange}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                        <Typography sx={{ display: 'flex', paddingRight: '3px', color: 'white' }}>
                          <Icon icon={saveIcon} fontSize={20} />
                        </Typography>
                        <Typography sx={{ color: 'white' }}>Save</Typography>
                      </Button>
                      <Button
                        size='large'
                        variant='outlined'
                        color='secondary'
                        sx={{ display: 'flex', alignItems: 'center' }}
                        onClick={handleCloseEditDialog}
                      >
                        <Typography sx={{ display: 'flex', paddingRight: '3px' }}>
                          {' '}
                          <Icon icon={cancelIcon} fontSize={20} />{' '}
                        </Typography>
                        <Typography>Cancel</Typography>
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Box sx={{ ml: 1 }}>
                  <Divider orientation="vertical" />
                </Box>
                <Box sx={{ mr: 3 }} >
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
                        <TableHead>
                          <TableRow sx={{ p: 0 }}>

                          </TableRow>
                        </TableHead>
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

                                    {/* <Select
                                  labelId="demo-simple-select-label"
                                  value={formValues[index].name}
                                  size='small'
                                  sx={{ width: '200px', margin: '4px' }}
                                  onChange={e => handleSubCategoryChange(index, e)}
                                >
                                  {activeSubCategory.map((item) => {
                                    return <MenuItem key={item.common_id} value={item.common_id}>{item.name}</MenuItem>
                                  })}
                                </Select> */}
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
                                          onChange={e => handleFormValueChange(index, e)}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={4} sx={{ mb: 1 }} >
                                        <TextField
                                          name='description'
                                          type='text'
                                          multiline
                                          maxRows={2}
                                          size='small'
                                          sx={{ width: '96%' }}
                                          value={formValues[index].description}
                                          label='Description'
                                          onChange={e => handleFormValueChange(index, e)}
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
          </Dialog>
          <Spinner loading={showSpinner} />
        </>{' '}
      </AppContext.Provider>
    </>
  )
}

export default ReceiptTransaction
