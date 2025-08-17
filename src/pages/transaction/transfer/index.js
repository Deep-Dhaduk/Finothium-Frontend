import {
    Autocomplete, Box, Button, Card, Dialog, DialogContent, DialogTitle, Divider, FormControl, FormHelperText, Grid, IconButton,
    Paper, Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Icon from 'src/@core/components/icon';
import PageHeader from 'src/@core/components/page-header';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { AppTooltip, CustomNoRowsOverlay, add5_5HoursToDate, formatDate, formatDateTime, getAllFilterData, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction';
import { fetchActiveAccountData } from 'src/api/active/accountActive';
import { fetchActiveCommonData } from 'src/api/active/commonActive';
import { addTransaction, deleteTransaction, fetchTransferData, updateTransaction } from 'src/api/allTransaction/transfer';
import DarkCopyButton from 'src/component/copyButton/DarkCopyButton';
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton';
import DarkEditButton from 'src/component/editButton/DarkEditButton';
import Spinner from 'src/component/spinner';
import { DateRangeContext, LoadingContext } from 'src/pages/_app';
import { paymentType, subCategory, transfer } from 'src/varibles/constant';
import { addIcon, cancelIcon, deleteIcon, helpIcon, rupeeSymbol, saveIcon } from 'src/varibles/icons';
import { navAllChildren } from 'src/varibles/navigation';
import { AppContext, advanceFilter, defaultFilterData, defaultPageSize, pageSizeLength } from 'src/varibles/variable';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import TableHeader from 'src/views/transaction/transfer/TableHeader';
import Swal from 'sweetalert2';



const Transfer = () => {
    const { settingDate, setSettingDate } = useContext(DateRangeContext)
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


    const defaultColumns = [
        {
            flex: 0.25,
            field: 'transactionDate',
            minWidth: 150,
            headerName: 'Date',
            renderCell: ({ row }) => {
                const formattedDate = formatDate(row.transactionDate)
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
            field: 'fromAccountName',
            headerName: 'From Account',
            renderCell: ({ row }) => <Typography variant='paragraph'>{row.fromAccountName}</Typography>
        },
        {
            flex: 0.25,
            minWidth: 100,
            field: 'toAccountName',
            headerName: 'To Account',
            renderCell: ({ row }) => <Typography variant='paragraph'>{row.toAccountName}</Typography>
        },
        {
            flex: 0.25,
            minWidth: 80,
            field: 'amount',
            headerName: 'Amount',
            renderCell: ({ row }) =>
                <Grid container>
                    <Grid item xs={11} sm={11}>
                        <Typography variant='paragraph' sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
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
                const utcDate = formatDateTime(row.updatedOn);
                return <Typography variant='paragraph'>{utcDate}</Typography>
            }
        }
    ]
    const location = useRouter()
    const [titleName, setTitleName] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0);
    const [formValues, setFormValues] = useState([{ subCategoryId: "", amount: '', description: "" }]);
    const [editValue, setEditValue] = useState({ date: '', paymentType: '', from: '', to: '', amount: 0, description: '' })
    const [value, setValue] = useState();
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [allIds, setAllIds] = useState({ ...defaultFilterData, startDate: settingDate.fromDate, endDate: settingDate.toDate })
    const [transferData, setTransferData] = useState([])
    const [error, setError] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [activeAccount, setActiveAccount] = useState([])
    const [activePaymentType, setActivePaymentType] = useState([])
    const [activeSubCategory, setActiveSubCategpry] = useState([])
    const [filterDropdownData, setFilterDropdownData] = useState({});
    const [advanceFilterConfig, setAdvanceFilterConfig] = useState(advanceFilter)

    let filterData = {
        startDate: allIds.startDate,
        endDate: allIds.endDate,
        paymentTypeIds: allIds.paymentTypeIds?.length === 0 ? null : allIds.paymentTypeIds,
        accountIds: allIds.accountIds?.length === 0 ? null : allIds.accountIds,
        clientTypeIds: allIds.clientTypeIds?.length === 0 ? null : allIds.clientTypeIds,
        categoryTypeIds: allIds.categoryTypeIds?.length === 0 ? null : allIds.categoryTypeIds,
        groupTypeIds: allIds.groupTypeIds?.length === 0 ? null : allIds.groupTypeIds,
        accountTypeIds: allIds.accountTypeIds?.length === 0 ? null : allIds.accountTypeIds,
        limit: null,
        fromAmount: null,
        toAmount: null,
        params: { q: value }
    }

    const getRowId = (row) => row.transfer_id;



    const handleChange = (e) => {
        setEditValue({ ...editValue, [e.target.name]: e.target.value })
    }

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        formValues.forEach((item) => {
            totalAmount += Number(item.amount)
        })
        setTotalAmt(totalAmount);
    };

    const handlePaymentChange = (event, newValue) => {
        const selectedValue = newValue ? newValue.common_id : '';
        setEditValue((prevValue) => ({
            ...prevValue,
            paymentType: selectedValue,
        }));
    };

    const handleEditData = row => {
        const adjustedDate = add5_5HoursToDate(new Date(row.transactionDate));
        setIsEdit(true)
        setEditValue({ id: row.transfer_id, date: adjustedDate, paymentType: row.paymentType_Id, fromAccount: row.fromAccount, toAccount: row.toAccount, amount: row.amount, description: row.description });
        { row.details.length != 0 ? setFormValues(row.details) : setFormValues([{ subCategoryId: '', amount: '', description: '' }]); }

        setEditDialogOpen(true)
    }

    const handleCopyData = row => {
        setEditDialogOpen(true)
        setIsEdit(false)
        const adjustedDate = add5_5HoursToDate(new Date(row.transactionDate));
        setEditValue({ id: null, date: adjustedDate, paymentType: row.paymentType_Id, fromAccount: row.fromAccount, toAccount: row.toAccount, amount: row.amount, description: row.description });
        { row.details.length != 0 ? setFormValues(row.details) : setFormValues([{ subCategoryId: '', amount: '', description: '' }]); }


    }

    const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen);

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

    const handleFromAccountChange = (event, newValue) => {
        const selectedValue = newValue ? newValue.account_id : '';
        setEditValue((prevValue) => ({
            ...prevValue,
            fromAccount: selectedValue,
        }));
    };

    const handleToAccountChange = (event, newValue) => {
        const selectedValue = newValue ? newValue.account_id : '';
        setEditValue((prevValue) => ({
            ...prevValue,
            toAccount: selectedValue,
        }));
    }

    const handleDateChange = (date) => {
        setEditValue({ ...editValue, date: date })
    }

    const dataTosubmit = async () => {
        setShowSpinner(true);
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
        const response = isEdit ? await updateTransaction(allData) : await addTransaction(allData);
        setTransferData(response.data)

        if (!response.success) {
            showErrorToast(response.message);
        } else {
            showSuccessToast(`Transfer ${isEdit ? "Updated" : "Added"} Successfully.`);
            handleCloseEditDialog();
        }
    }

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!editValue.date || !editValue.paymentType || !editValue.fromAccount || !editValue.toAccount || !editValue.amount) {
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
            if (editValue.fromAccount === editValue.toAccount) {
                showErrorToast("Please Select Different Account Name. ")
                return
            }
        } catch (error) {
            console.error("An error occurred asynchronously:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false)
    }

    const handleFilter = useCallback(val => {
        setValue(val)
    }, [])

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#7066e0"
            });

            if (result.isConfirmed) {
                setShowSpinner(true);
                const allData = { filterData, id }
                const response = await deleteTransaction(allData)
                setTransferData(response.data)
                if (!response.success) {
                    showErrorToast("Error in deleting");
                } else {
                    showSuccessToast("Transfer Deleted Successfully.");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            showErrorToast("An error occurred while deleting the transfer.");
        } finally {
            setShowSpinner(false);
        }
    }

    const themeMode = JSON.parse(localStorage.getItem("settings"))

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
                    <DarkDeleteButton handleDelete={handleDelete} id={row.transfer_id} titleName={titleName} />
                    <DarkCopyButton handleCopyData={handleCopyData} row={row} title="Copy" titleName={titleName} />
                </Box>
            )
        },
        ...defaultColumns,

    ].map(column => {
        if (column.field === 'description') {
            return {
                ...column,
                renderCell: (params) => (
                    <AppTooltip placement='top' title={params.row.description}>
                        <Typography variant='paragraph'>{params.row.description}</Typography>
                    </AppTooltip>
                ),
            };
        }
        return column;
    });

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const response = await fetchTransferData(filterData)
            setTransferData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        } finally {
            setShowSpinner(false);
        }
    };

    const fetchFilterData = async () => {
        try {
            setShowSpinner(true);
            const response = await getAllFilterData()
            setFilterDropdownData(response)
        } catch (error) {
            console.error(`Error fetching filter data:`, error);
        } finally {
            setShowSpinner(false);
        }
    }

    const fetchActiveAccount = async () => {
        const response = await fetchActiveAccountData()
        setActiveAccount(response.data)
    }

    const fetchActivePaymentType = async () => {
        const response = await fetchActiveCommonData({ type: paymentType })
        setActivePaymentType(response.data)
    }

    const fetchActiveSubCategory = async () => {
        const response = await fetchActiveCommonData({ type: subCategory })
        setActiveSubCategpry(response.data)
    }

    const fetchSearchFilterData = async () => {
        try {
            const response = await fetchTransferData(filterData)
            setTransferData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        }
    }

    useEffect(() => {
        calculateTotalAmount()
    }, [formValues])

    useEffect(() => {
        filterData = { ...filterData, startDate: settingDate.fromDate, endDate: settingDate.toDate }
        setAllIds({ ...allIds, startDate: settingDate.fromDate, errorndDate: settingDate.toDate })
        fetchData()
        fetchFilterData()
    }, [settingDate])

    useEffect(() => {
        setAdvanceFilterConfig({ ...advanceFilterConfig, showFromDate: true, showToDate: true, showAccountName: true, showPaymentTypeName: true, showFromAmount: true, showToAmount: true })
        const navSetting = navAllChildren.find(x => x.path === location.pathname)
        const title = navSetting.title ?? ''
        setTitleName(title)
        fetchActiveAccount()
        fetchActivePaymentType()
        fetchActiveSubCategory()
    }, [])

    useEffect(() => {
        fetchSearchFilterData()
    }, [value])

    useEffect(() => {
        if (formValues.length === 0) {
            setFormValues([{ subCategoryId: '', amount: '', description: '' }])
        }
    }, [formValues])

    return (
        <>
            <AppContext.Provider value={{ allIds, setAllIds }} >
                <>
                    <Grid container spacing={6}>
                        <Grid item xs={12} className='module-heading'>
                            <PageHeader
                                title={<Typography variant='h6'>
                                    {titleName}
                                </Typography>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <TableHeader value={value} filename={'transferData'} handleFilter={handleFilter} type={transfer} transferData={transferData} titleName={titleName} setTransferData={setTransferData} filterDropdownData={filterDropdownData} advanceFilterConfig={advanceFilterConfig} activeAccount={activeAccount} activePaymentType={activePaymentType} activeSubCategory={activeSubCategory} filterData={filterData} />
                                <div className="menu-item-hide">
                                    <DataGrid
                                        autoHeight
                                        rows={transferData}
                                        columns={columns}
                                        pageSize={pageSize}
                                        getRowId={getRowId}
                                        disableSelectionOnClick
                                        rowsPerPageOptions={pageSizeLength}
                                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                                        components={{
                                            NoRowsOverlay: CustomNoRowsOverlay,
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
                                {isEdit ? "Edit" : "Add"} Transfer Transaction
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
                                                        sx={{ width: 100 }}
                                                        selected={editValue.date}
                                                        id='basic-input'
                                                        dateFormat='d-MMMM-yyyy'
                                                        popperPlacement={popperPlacement}
                                                        onChange={(date) => handleDateChange(date)}
                                                        placeholderText='Click to select a date'
                                                        customInput={<CustomInput label='Transaction Date' error={error && !editValue.date} />}
                                                    />
                                                    {error && !editValue.date && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Date.</FormHelperText>}
                                                </DatePickerWrapper>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth sx={{ mb: 4 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        value={activePaymentType.find((item) => item.common_id === editValue.paymentType) || null}
                                                        onChange={(event, newValue) => handlePaymentChange(event, newValue)}
                                                        options={activePaymentType}
                                                        getOptionLabel={(item) => item.name}
                                                        renderInput={(params) => (
                                                            <TextField {...params} label="Select Payment Type" variant="outlined" error={error && !editValue.paymentType} />
                                                        )}
                                                    />
                                                    {error && !editValue.paymentType && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Payment Type.</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth sx={{ mb: 4 }}>

                                                    <Autocomplete
                                                        fullWidth
                                                        value={activeAccount.find((item) => item.account_id === editValue.fromAccount) || null}
                                                        onChange={(event, newValue) => handleFromAccountChange(event, newValue)}
                                                        options={activeAccount}
                                                        getOptionLabel={(item) => item.account_name}
                                                        renderInput={(params) => (
                                                            <TextField {...params} label="Select From Account" variant="outlined" error={error && !editValue.fromAccount} />
                                                        )}
                                                    />
                                                    {error && !editValue.fromAccount && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select From Account.</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth sx={{ mb: 4 }}>
                                                    <Autocomplete
                                                        fullWidth
                                                        value={activeAccount.find((item) => item.account_id === editValue.toAccount) || null}
                                                        onChange={(event, newValue) => handleToAccountChange(event, newValue)}
                                                        options={activeAccount}
                                                        getOptionLabel={(item) => item.account_name}
                                                        renderInput={(params) => (
                                                            <TextField {...params} label="Select To Account" variant="outlined" error={error && !editValue.toAccount} />
                                                        )}
                                                    />
                                                    {error && !editValue.toAccount && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select To Account.</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Box sx={{ mb: 4 }}>
                                            <TextField
                                                name='amount'
                                                fullWidth
                                                type='number'
                                                value={editValue.amount}
                                                label='Amount'
                                                // sx={{ mr: [0, 4], mb: [3, 0] }}
                                                onChange={handleChange}
                                                error={error && !editValue.amount}
                                            />
                                            {error && !editValue.amount && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Amount.</FormHelperText>}
                                        </Box>
                                        <Box sx={{ mb: 4 }}>
                                            <TextField
                                                name='description'
                                                fullWidth
                                                value={editValue.description}
                                                label='Description'
                                                // sx={{ mr: [0, 4], mb: [3, 0] }}
                                                onChange={handleChange}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                                                <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} fontSize={20} /></Typography>
                                                <Typography sx={{ color: "white" }}>Save</Typography>
                                            </Button>
                                            <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleCloseEditDialog}>
                                                <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                                                <Typography>Cancel</Typography>
                                            </Button>
                                        </Box>
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
                                                                {/* </CardContent> */}
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

                </>
            </AppContext.Provider>
        </>
    )
}

export default Transfer