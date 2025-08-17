// ** MUI Imports
import { Box, Button, Card, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CustomNoRowsOverlay, formatDateTime, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { deleteRole, fetchRoleData, updateRole } from 'src/api/utility/roleMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { adminRoleName, superAdminRoleName, userRoleName } from 'src/varibles/constant'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import TableHeader from 'src/views/apps/roles/TableHeader'
import Swal from 'sweetalert2'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'rolename',
    minWidth: 240,
    headerName: 'Role Name',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.rolename}</Typography>
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
    field: 'updatedOn',
    headerName: 'Updated',
    // sortable: false,
    renderCell: ({ row }) => {
      const utcDate = formatDateTime(row.updatedOn);
      return <Typography variant='paragraph'>{utcDate}</Typography>
    }
  }
]


const RolesComponent = () => {
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const location = useRouter()
  const [titleName, setTitleName] = useState('');
  const [editDialogBox, setEditDialogBox] = useState(false)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [value, setValue] = useState('')
  const [editValue, setEditValue] = useState({ rolename: '', status: 1 })
  const [error, setError] = useState(false)
  const [roleData, setRoleData] = useState(false)

  const store = useSelector(store => store.role)

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])


  const handleEditData = (item) => {
    setEditDialogBox((prev) => !prev);
    setEditValue({ id: item.id, rolename: item.rolename, status: item.status })
  }

  const handleEditClickClose = () => {
    setEditDialogBox(false)
  }

  const handleEditRadioChange = event => {
    setEditValue({ ...editValue, status: event.target.value })
  }

  const handleChange = (e) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
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
        const allData = { id, params: { q: value } }
        const response = await deleteRole(allData);
        setRoleData(response.data)
        if (!response.success) {
          showErrorToast(response.message);
        } else {
          showSuccessToast("Role Deleted Successfully.");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showErrorToast("An error occurred while deleting the role.");
    } finally {
      setShowSpinner(false);
    }
  };

  const theme = JSON.parse(localStorage.getItem("settings"))

  const columns = [
    {
      flex: 0.15,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        const isUserOrAdmin = row.rolename.toLowerCase() === userRoleName || row.rolename.toLowerCase() === adminRoleName || row.rolename.toLowerCase() === superAdminRoleName;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isUserOrAdmin ? null : ( // Don't display icons for "user" and "admin" roles
              <>
                <DarkEditButton handleEditData={handleEditData} row={row} titleName={titleName} />
                <DarkDeleteButton handleDelete={handleDelete} id={row.id} titleName={titleName} />
              </>
            )}
          </Box>
        )
      }
    },
    ...defaultColumns
  ]

  const onSubmit = async (e) => {

    try {
      e.preventDefault();
      if (!editValue.rolename) {
        setError(true)
        return
      }

      setShowSpinner(true);
      const response = await updateRole(editValue, { q: value });
      setRoleData(response.data)

      if (!response.success) {
        // Show error toaster if response.error is true
        showErrorToast(response.message);
      } else {
        setEditDialogBox(false);
        showSuccessToast("Role Updated successfully.");

      }
    } catch (error) {

      console.error("An error occurred synchronously:", error);
      showErrorToast(error.response.data.message ? error.response.data.message : "An unexpected error occurred. Please try again later.");
    } finally {
      setShowSpinner(false);
    }
  };


  const fetchData = async () => {
    try {
      setShowSpinner(true);
      const response = await fetchRoleData()
      setRoleData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error);
    } finally {
      setShowSpinner(false);
    }
  };

  const filterSearchData = async () => {
    try {
      const response = await fetchRoleData({ q: value })
      setRoleData(response.data)
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
              <TableHeader value={value} handleFilter={handleFilter} data={roleData} titleName={titleName} setRoleData={setRoleData} />
              <div className="menu-item-hide">
                <DataGrid
                  autoHeight
                  rows={roleData}
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

        {editDialogBox && <Dialog fullWidth maxWidth='sm' scroll='body' onClose={handleEditClickClose} open={editDialogBox}>
          <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
            <Typography variant='h5' component='span'>
              {`Edit Role`}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 4 }}>
            <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
              <Box >
                <FormControl fullWidth>
                  <TextField
                    label='Role Name'
                    name='rolename'
                    value={editValue.rolename}
                    onChange={handleChange}
                    error={error && !editValue.rolename}
                  />
                  {error && !editValue.rolename && <FormHelperText variant='paragraph' sx={{ color: "error.main" }}>Role Name is Required.</FormHelperText>}
                </FormControl>
              </Box>
              <Grid container spacing={6} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6}>
                  <RadioGroup row aria-label='controlled' name='controlled' value={editValue.status} onChange={handleEditRadioChange}>
                    <FormControlLabel value={1} control={<Radio />} label='Active' />
                    <FormControlLabel value={0} control={<Radio />} label='InActive' />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Box sx={{ display: "flex" }}>
                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                  <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} fontSize={20} /></Typography>
                  <Typography sx={{ color: "white" }}>Save</Typography>
                </Button>
                <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleEditClickClose}>
                  <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                  <Typography>Cancel</Typography>
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>}
        <Spinner loading={showSpinner} />

        {/* <Grid item xs={12}>
        <Table />
      </Grid> */}
      </>
    </>
  )
}

export default RolesComponent
