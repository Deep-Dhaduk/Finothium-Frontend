// ** React Imports
import { useCallback, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/apps/tenant/TableHeader'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Actions Imports
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { AppTooltip, CustomNoRowsOverlay, formatDate, formatDateTime, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { loginAsTenant } from 'src/api/loginAsTenant'
import { deleteTenant, fetchTenantData, updateTenant } from 'src/api/utility/tenantMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import DarkLoginButton from 'src/component/logInAsUserButton/DarkLoginButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { tenantExpireWarningDays } from 'src/varibles/constant'
import { alertIcon, cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import Swal from 'sweetalert2'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'tenantname',
        minWidth: 100,
        headerName: 'Tenant Name',
        renderCell: ({ row }) => {
            return (
                <Grid container>
                    <Grid item xs={10} sm={10} sx={{ display: 'flex', alignItems: 'center' }}> <Typography variant='paragraph'>{row.tenantname}</Typography></Grid>
                    <Grid item xs={2} sm={2} sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {(row.tenantDays > 0 && row.tenantDays < tenantExpireWarningDays) &&
                                <AppTooltip title={`This Tenant's subscription will expire in ${row.tenantDays} days.`} placement="top">
                                    <Typography sx={{
                                        ml: 3, color: 'warning.light', cursor: 'pointer'
                                    }}> <Icon icon={alertIcon} fontSize={16} />

                                    </Typography>
                                </AppTooltip>
                            }
                            {row.tenantDays === 0 &&
                                <AppTooltip title="This Tenant's subscription is expiring Today." placement="top">
                                    <Typography sx={{
                                        ml: 3, color: 'warning.light', cursor: 'pointer'
                                    }}> <Icon icon={alertIcon} fontSize={16} /></Typography>
                                </AppTooltip>
                            }
                            {row.tenantDays < 0 &&
                                <AppTooltip title={`This Tenant's subscription was expired ${Math.abs(row.tenantDays)} days ago.`} placement="top">
                                    <Typography sx={{
                                        ml: 3, color: 'error.light', cursor: 'pointer'
                                    }}> <Icon icon={alertIcon} fontSize={16} /></Typography>
                                </AppTooltip>
                            }
                        </Box>
                    </Grid>
                </Grid>
            )
        }
    },
    {
        flex: 0.25,
        field: 'personname',
        minWidth: 120,
        headerName: 'Person Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.personname}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 150,
        field: 'email',
        headerName: 'Email',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.email}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 130,
        field: 'startdate',
        headerName: 'Start Date',
        sortable: true,
        renderCell: ({ row }) => {
            const utcDate = formatDate(row.startdate)
            return <Typography variant='paragraph'>{utcDate}</Typography>
        }
    },
    {
        flex: 0.25,
        minWidth: 130,
        field: 'enddate',
        headerName: 'End Date',
        // sortable: false,
        renderCell: ({ row }) => {
            const utcDate = formatDate(row.enddate)
            return <Typography variant='paragraph'>{utcDate}</Typography>
        }
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => <Typography variant='paragraph' style={{ color: row.status === 1 ? '#72E128' : '#FF4D49' }}>{row.status === 1 ? "Active" : "InActive"}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 130,
        field: 'updatedOn',
        headerName: 'Updated',
        // sortable: false,
        renderCell: ({ row }) => {
            const utcDate = formatDateTime(row.updatedOn);
            return <Typography variant='paragraph'>{utcDate}</Typography>
        }
    }

]

const Tenant = () => {

    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    const location = useRouter()
    const [titleName, setTitleName] = useState('');
    const [value, setValue] = useState('')
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [editValue, setEditValue] = useState({
        tenantName: '',
        personName: '',
        address: '',
        contactNo: '',
        email: '',
        startDate: null,
        endDate: null,
        status: 1,
    })
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [error, setError] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [tenantData, setTenantData] = useState([])
    const { showSpinner, setShowSpinner } = useContext(LoadingContext)


    // ** Hooks

    const getRowId = (row) => row.tenantId;

    const handleFilter = useCallback(val => {
        setValue(val)
    }, [])

    const handleEditData = row => {
        setStartDate(new Date(row.startdate))
        { row.enddate !== null && setEndDate(new Date(row.enddate)) }
        setEditValue({ id: row.tenantId, tenantName: row.tenantname, personName: row.personname, address: row.address, contactNo: row.contact, email: row.email, startDate: startDate, endDate: endDate, status: row.status });
        setEditDialogOpen(true)
    }
    const handleDialogToggle = () => {
        setEditDialogOpen(!editDialogOpen)
    }

    const handleChange = (e) => {
        setEditValue({ ...editValue, [e.target.name]: e.target.value })
    }

    const handleRadioChange = event => {
        setEditValue({
            ...editValue,
            status: Number(event.target.value),
        });
    }

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            if (!editValue.tenantName || !editValue.personName || !editValue.email || !editValue.address || !editValue.contactNo || !startDate || !endDate) {
                setError(true); // Set error state to true
                return; // Exit early if any required field is blank
            }
            setShowSpinner(true);
            setEditDialogOpen(false);

            const data = { ...editValue, startDate, endDate: endDate }


            const response = await updateTenant(data, { q: value });
            setTenantData(response.data)

            if (!response.success) {
                // Show error toaster if response.error is true
                showErrorToast(response.message);
                setEditDialogOpen(true);
            } else {
                showSuccessToast("Tanent Updated Successfully.");
                handleCloseEditDialog()
            }
            setEndDate('');
        } catch (error) {
            // Handle any synchronous errors
            console.error("An error occurred synchronously:", error);
            setEditDialogOpen(true)
            // Optionally, show an error toast to the user
            showErrorToast(error.response.data.message ? error.response.data.message : "An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };


    const handleCloseEditDialog = () => {
        setEditDialogOpen(false)
        setStartDate()
        setError(false)
        setEndDate('')
    }

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
                const data = { id, params: { q: value } }
                const response = await deleteTenant(data);
                setTenantData(response.data)
                if (!response.success) {
                    showErrorToast(response.message);
                } else {
                    showSuccessToast("Tenant Deleted Successfully.");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            showErrorToast("An error occurred while deleting the tenant.");
        } finally {
            setShowSpinner(false);
        }
    };
    const user = JSON.parse(localStorage.getItem("userData"))
    const token = localStorage.getItem("accessToken")
    const router = useRouter()

    const handleLoginTenant = async (id) => {
        try {
            setShowSpinner(true)
            const response = await loginAsTenant(id)
            localStorage.setItem('MainToken', token)
            localStorage.setItem('MainUser', JSON.stringify(user))
            localStorage.setItem('userData', JSON.stringify(response.data.userData))
            localStorage.setItem('accessToken', response.data.token)
            window.location.href = '/dashboard';
        } catch (error) {

        } finally {
            setTimeout(() => {
                setShowSpinner(false)
            }, 1000);
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
                    {row.tenantId !== -1 && <DarkDeleteButton handleDelete={handleDelete} id={row.tenantId} titleName={titleName} />}
                    {row.tenantId !== -1 && <DarkLoginButton titleName={titleName} handleLoginTenant={handleLoginTenant} id={row.tenantId} />}
                </Box>
            )
        },
        ...defaultColumns
    ]


    const updatedColumns = columns.map(column => {
        if (column.field === 'address') {
            return {
                ...column,
                renderCell: (params) => (
                    <AppTooltip placement='bottom' title={params.value}>
                        <span> {params.value}</span>
                    </AppTooltip>
                ),
            };
        }
        return column;
    });

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const response = await fetchTenantData({ q: params })
            setTenantData(response.data)

        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        } finally {
            setShowSpinner(false);
        }
    };

    const filterSearchData = async () => {
        try {
            const response = await fetchTenantData({ q: value })
            setTenantData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        }
    }


    useEffect(() => {
        const navSetting = navAllChildren.find(x => x.path === location.pathname)
        const title = navSetting.title ?? ''
        setTitleName(title)
        fetchData();
    }, [])

    useEffect(() => {
        filterSearchData()
    }, [value])

    return (
        <>

            <>
                <Grid container spacing={6}>
                    <Grid item xs={12} className='module-heading'>
                        <PageHeader
                            title={<Typography variant='h6'>{titleName}</Typography>}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <TableHeader value={value} handleFilter={handleFilter} tenantData={tenantData} setTenantData={setTenantData} titleName={titleName} />
                            <div className="menu-item-hide">
                                <DataGrid
                                    autoHeight
                                    rows={tenantData}
                                    columns={updatedColumns}
                                    getRowId={getRowId}
                                    pageSize={pageSize}
                                    disableSelectionOnClick
                                    rowsPerPageOptions={pageSizeLength}
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                                />
                            </div>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
                    <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
                        <Typography variant='h6' component='span'>
                            Edit Tenant
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pb: 4 }}>
                        <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 6 }}>
                                        <TextField
                                            name='tenantName'
                                            fullWidth
                                            value={editValue.tenantName}
                                            label='Tenant Name'
                                            sx={{ mr: [0, 4], mb: [3, 0] }}
                                            onChange={handleChange}
                                            error={error && !editValue.tenantName}
                                        />
                                        {error && !editValue.tenantName && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Tenant Name is Required.</FormHelperText>}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            name='personName'
                                            fullWidth
                                            value={editValue.personName}
                                            label='Person Name'
                                            sx={{ mr: [0, 4], mb: [3, 0] }}
                                            onChange={handleChange}
                                            error={error && !editValue.personName}
                                        />
                                        {error && !editValue.personName && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Person Name is Required.</FormHelperText>}
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box sx={{ mb: 6 }}>
                                <TextField
                                    name='address'
                                    fullWidth
                                    multiline
                                    maxRows={6}
                                    value={editValue.address}
                                    label='Address'
                                    sx={{ mr: [0, 4], mb: [3, 0] }}
                                    onChange={handleChange}
                                    error={error && !editValue.address}
                                />
                                {error && !editValue.address && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Address is Required.</FormHelperText>}
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 6 }}>
                                        <TextField
                                            name='contactNo'
                                            fullWidth
                                            value={editValue.contactNo}
                                            label='Contact No'
                                            sx={{ mr: [0, 4], mb: [3, 0] }}
                                            onChange={handleChange}
                                            error={error && !editValue.contactNo}
                                        />
                                        {error && !editValue.contactNo && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Please Select Contact No.</FormHelperText>}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ mb: 6 }}>
                                        <TextField
                                            name='email'
                                            fullWidth
                                            value={editValue.email.toLowerCase()}
                                            label='Email'
                                            sx={{ mr: [0, 4], mb: [3, 0] }}
                                            onChange={handleChange}
                                            error={error && !editValue.email}
                                        />
                                        {error && !editValue.email && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Email is Required.</FormHelperText>}
                                    </Box>
                                </Grid>
                            </Grid>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <DatePickerWrapper fullWidth>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} >
                                            <DatePicker
                                                selected={startDate}
                                                id='basic-input'
                                                popperPlacement={popperPlacement}
                                                onChange={date => {
                                                    setStartDate(date);
                                                    setError(false); // Reset error state when the date is changed
                                                }}

                                                dateFormat='d-MMMM-yyyy'
                                                placeholderText='Click to select a date'
                                                customInput={<CustomInput label='Start Date' error={error && !startDate} />
                                                }
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
                            <Grid container spacing={6} sx={{ mb: 6 }}>
                                <Grid item xs={12} sm={12}>
                                    <RadioGroup row aria-label='controlled' name='controlled' value={editValue.status} onChange={handleRadioChange}>
                                        <FormControlLabel value={1} control={<Radio disabled={editValue.id == -1} />} label='Active' />
                                        <FormControlLabel value={0} control={<Radio disabled={editValue.id == -1} />} label='InActive' />
                                    </RadioGroup>
                                </Grid>

                            </Grid>
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
                    </DialogContent>
                </Dialog>
                <Spinner loading={showSpinner} />

            </>
        </>
    )
}

export default Tenant