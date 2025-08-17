// ** React Imports
import { useCallback, useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useSelector } from 'react-redux'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/apps/childMenu/TableHeader'

// ** Actions Imports
import { Autocomplete, FormControl, FormHelperText, Radio, RadioGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { CustomNoRowsOverlay, formatDateTime, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { deleteChildMenu, fetchChildMenuData, updateChildMenu } from 'src/api/utility/childMenu'
import { fetchParentMenuData } from 'src/api/utility/parentMenu'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import Swal from 'sweetalert2'

const defaultColumns = [

    {
        flex: 0.25,
        field: 'menu_name',
        minWidth: 240,
        headerName: 'Menu Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.menu_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 100,
        field: 'display_rank',
        headerName: 'Display Rank',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.display_rank}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 215,
        field: 'status',
        headerName: 'Status',
        renderCell: ({ row }) => <Typography variant='paragraph' style={{ color: row.status === 1 ? '#72E128' : '#FF4D49' }}>{row.status === 1 ? "Active" : "InActive"}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 215,
        field: 'parent_menu_name',
        headerName: 'Parent Menu',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.parent_menu_name}</Typography>
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

const ChildMenu = () => {
    // ** State
    const location = useRouter()
    const [titleName, setTitleName] = useState('');
    const [value, setValue] = useState('')
    const [pageSize, setPageSize] = useState(defaultPageSize)
    const [editValue, setEditValue] = useState({})
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [error, setError] = useState(false)
    const [childData, setChildData] = useState(false)
    const [activeParent, setActiveParent] = useState([]);

    const { showSpinner, setShowSpinner } = useContext(LoadingContext)

    // ** Hooks
    const storeParent = useSelector(state => state.parentActive)

    const handleChange = (e) => setEditValue({ ...editValue, [e.target.name]: e.target.value })
    const handleRadioChange = (event) => setEditValue({ ...editValue, status: event.target.value })
    const handleCloseEditDialog = () => setEditDialogOpen(false)

    const handleFilter = useCallback(val => {
        setValue(val)
    }, [])

    const handleParentMenuChange = (event, newValue) => {
        const selectedValue = newValue ? newValue.id : '';
        setEditValue((prevValue) => ({
            ...prevValue,
            parentId: selectedValue,
        }));
    };

    const handleEditData = row => {
        setEditValue({ id: row.id, name: row.menu_name, parentId: row.parent_id, displayRank: row.display_rank, status: row.status })
        setEditDialogOpen(true)
    }
    const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

    const onSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!editValue.name || !editValue.parentId || !editValue.displayRank) {
                setError(true)
                return
            }
            setShowSpinner(true);
            setEditDialogOpen(false);

            const response = await updateChildMenu(editValue, { q: value });
            setChildData(response.data)
            if (!response.success) {
                showErrorToast(response.message);
            } else {
                setEditDialogOpen(false)
                showSuccessToast("Child Menu Updated Successfully.");
            }
        } catch (error) {
            console.error("An error occurred synchronously:", error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        } finally {
            setShowSpinner(false);
        }
    };

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
                const response = await deleteChildMenu(data);
                setChildData(response.data)
                if (!response.success) {
                    showErrorToast(response.message);
                } else {
                    showSuccessToast("Child Menu Deleted Successfully.");
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
            showErrorToast("An error occurred while deleting the child menu.");
        } finally {
            setShowSpinner(false);
        }
    };

    const themeMode = JSON.parse(localStorage.getItem('settings'))

    const columns = [
        {
            flex: 0.15,
            minWidth: 100,
            sortable: false,
            field: 'actions',
            headerName: 'Actions',
            renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DarkEditButton handleEditData={handleEditData} row={row} titleName={titleName} />
                    <DarkDeleteButton handleDelete={handleDelete} id={row.id} titleName={titleName} />
                </Box>
            )
        },
        ...defaultColumns
    ]

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const response = await fetchChildMenuData(filterData)
            setChildData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        } finally {
            setShowSpinner(false);
        }
    }

    const fetchActiveParentMenu = async () => {
        const response = await fetchParentMenuData()
        setActiveParent(response.data)
    }

    const filterSearchData = async () => {
        try {
            const response = await fetchChildMenuData({ q: value })
            setChildData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        }
    }

    useEffect(() => {
        filterSearchData()
    }, [value])

    useEffect(() => {
        const navSetting = navAllChildren.find(x => x.path === location.pathname)
        const title = navSetting.title ?? ''
        setTitleName(title)
        fetchData();
        fetchActiveParentMenu()
    }, [])

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
                            <TableHeader value={value} handleFilter={handleFilter} childData={childData} titleName={titleName} setChildData={setChildData} activeParent={activeParent} />
                            <div className="menu-item-hide">
                                <DataGrid
                                    autoHeight
                                    rows={childData}
                                    columns={columns}
                                    pageSize={pageSize}
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
                <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
                    <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
                        <Typography variant='h6' component='span' sx={{ mb: 2 }}>
                            Edit Child Menu
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pb: 4 }}>
                        <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
                            <FormControl fullWidth sx={{ mb: 6 }}>
                                <Autocomplete
                                    fullWidth
                                    value={activeParent.find((menu) => menu.id === editValue.parentId) || null}
                                    onChange={(event, newValue) => handleParentMenuChange(event, newValue)}
                                    options={activeParent}
                                    getOptionLabel={(option) => option.menu_name}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Parent Menu" variant="outlined"
                                            error={error && !editValue.parentId}
                                        />
                                    )}
                                />
                                {error && !editValue.parentId && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Parent Menu.</FormHelperText>}
                            </FormControl>
                            <Box sx={{ mb: 6 }}>
                                <TextField
                                    fullWidth
                                    name='name'
                                    value={editValue.name}
                                    label='Menu Name'
                                    sx={{ mr: [0, 4], mb: [3, 0] }}
                                    onChange={handleChange}
                                    error={error && !editValue.name}
                                />
                                {error && !editValue.name && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Menu Name is Required.</FormHelperText>}
                            </Box>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    name='displayRank'
                                    type='number'
                                    value={editValue.displayRank}
                                    label='Display Rank'
                                    sx={{ mr: [0, 4], mb: [3, 0] }}
                                    onChange={handleChange}
                                    error={error && !editValue.displayRank}
                                />
                                {error && !editValue.displayRank && <FormHelperText variant='paragraph' sx={{ color: 'error.main' }}> Display Rank is Required.</FormHelperText>}
                            </FormControl>

                            <Grid container spacing={6} sx={{ mb: 6 }}>
                                <Grid item xs={12} sm={6}>
                                    <RadioGroup row aria-label='controlled' name='controlled' value={editValue.status} onChange={handleRadioChange}>
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

export default ChildMenu
