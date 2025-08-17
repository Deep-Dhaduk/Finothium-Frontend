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
import { DataGrid } from '@mui/x-data-grid'
import Swal from 'sweetalert2'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/master/company/TableHeader'

// ** Actions Imports
import { FormControlLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import {
  CustomNoRowsOverlay,
  checkAllowAdd,
  formatDateTime,
  getDecodedTokenValue,
  showErrorToast,
  showSuccessToast
} from 'src/allFunction/commonFunction'
import { deleteCompany, fetchCompanyData, updateCompany } from 'src/api/master/companyMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { userMaster } from 'src/varibles/constant'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'company_name',
    minWidth: 210,
    headerName: 'Company Name',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.company_name}</Typography>
  },
  {
    flex: 0.35,
    minWidth: 150,
    field: 'authorize_person_name',
    headerName: 'Authorize Person',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.authorize_person_name}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 150,
    field: 'pan',
    headerName: 'PAN',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.pan}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 180,
    field: 'gstin',
    headerName: 'GSTIN',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.gstin}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 60,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => (
      <Typography variant='paragraph' style={{ color: row.status === 1 ? '#72E128' : '#FF4D49' }}>
        {row.status === 1 ? 'Active' : 'InActive'}
      </Typography>
    )
  },
  {
    flex: 0.25,
    minWidth: 130,
    field: 'updatedOn',
    headerName: 'Updated',
    renderCell: ({ row }) => {
      const dateFormate = formatDateTime(row.updatedOn)
      return <Typography variant='paragraph'>{dateFormate}</Typography>
    }
  }
]

const Company = () => {
  const location = useRouter()
  const [titleName, setTitleName] = useState('')
  // ** State
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [companyData, setCompanyData] = useState([])
  const [editValue, setEditValue] = useState({
    companyName: '',
    legalName: '',
    authorizePersonName: '',
    address: '',
    contactNo: '',
    email: '',
    website: '',
    PAN: '',
    GSTIN: '',
    status: ''
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [error, setError] = useState(false)
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const theme = JSON.parse(localStorage.getItem('settings'))

  const router = useRouter()

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleEditPermission = row => {
    setEditValue({
      id: row.id,
      companyName: row.company_name,
      legalName: row.legal_name,
      authorizePersonName: row.authorize_person_name,
      address: row.address,
      contactNo: row.contact_no,
      email: row.email,
      website: row.website,
      PAN: row.pan,
      GSTIN: row.gstin,
      status: row.status
    })
    setEditDialogOpen(true)
  }
  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleChange = e => {
    const { name, value } = e.target

    const updatedValue = ['PAN', 'GSTIN'].includes(name) ? value.toUpperCase() : value

    setEditValue({ ...editValue, [name]: updatedValue })
  }

  const handleRadioChange = event => {
    setEditValue({
      ...editValue,
      status: event.target.value
    })
  }

  const onSubmit = async e => {
    try {
      e.preventDefault()
      if (!editValue.companyName || !editValue.PAN || !editValue.GSTIN || !editValue.legalName) {
        setError(true)
        return
      }
      setShowSpinner(true)
      const response = await updateCompany(editValue, { q: value })
      setCompanyData(response.data)

      if (!response.success) {
        showErrorToast(response.message)
      } else {
        setEditDialogOpen(false)
        showSuccessToast('Company Updated Successfully.')
      }
    } catch {
      console.error('An error occurred synchronously:', error)
      showErrorToast(error.response.data.message ? error.response.data.message : 'An unexpected error occurred. Please try again later.')
    } finally {
      setShowSpinner(false)
    }
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
  }

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
        const allData = { id, params: { q: value } }
        const response = await deleteCompany(allData)
        setCompanyData(response.data)
        if (!response.success) {
          showErrorToast(response.message)
        } else {
          showSuccessToast('Company Deleted Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      showErrorToast('An error occurred while deleting the company.')
    } finally {
      setShowSpinner(false)
    }
  }

  const { companyId } = getDecodedTokenValue()

  const columns = [
    {
      flex: 0.15,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DarkEditButton handleEditData={handleEditPermission} row={row} titleName={titleName} />
          {row.id !== companyId && <DarkDeleteButton handleDelete={handleDelete} id={row.id} titleName={titleName} />}
        </Box>
      )
    },
    ...defaultColumns
  ]

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchCompanyData({ q: value })
      setCompanyData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    } finally {
      setShowSpinner(false)
    }
  }

  const filterSearchData = async () => {
    try {
      const response = await fetchCompanyData({ q: value })
      setCompanyData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    }
  }

  useEffect(() => {
    filterSearchData()
  }, [value])

  useEffect(() => {
    const navSetting = navAllChildren.find(x => x.path === location.pathname)
    const title = navSetting.title ?? ''
    setTitleName(title)
    fetchData()
  }, [])

  const store = useSelector(store => store.roleWisePermission)

  const addVisibility = checkAllowAdd(store.data, userMaster)

  return (
    <>
      <>
        <Grid container spacing={6}>
          <Grid item xs={12} className='module-heading'>
            <PageHeader title={<Typography variant='h6'>{titleName}</Typography>} />
          </Grid>
          <Grid item xs={12}>
            <Card>
              <TableHeader
                value={value}
                handleFilter={handleFilter}
                companyData={companyData}
                titleName={titleName}
                setCompanyData={setCompanyData}
              />
              <div className='menu-item-hide'>
                <DataGrid
                  autoHeight
                  rows={companyData}
                  columns={columns}
                  pageSize={pageSize}
                  disableSelectionOnClick
                  rowsPerPageOptions={pageSizeLength}
                  onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                  components={{
                    NoRowsOverlay: CustomNoRowsOverlay
                  }}
                  sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                  onSortModelChange={sortModel => { }}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'companyName', sort: 'desc' }]
                    }
                  }}
                />
              </div>
              {addVisibility && (
                <Typography
                  variant='paragraph'
                  sx={{
                    backgroundColor: theme.mode === 'dark' ? '#3A3E5B' : '#F5F5F7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    p: 2,
                    color: 'error.main',
                    fontSize: 14
                  }}
                >
                  Note: To view a newly added company here, visit the{' '}
                  <Typography
                    sx={{
                      color: '#666CFF',
                      cursor: 'pointer',
                      mx: 2,
                      fontSize: '14px',
                      ':hover': {
                        color: theme.mode === 'dark' ? '#C2C2C5' : '#85858C',
                        textDecoration: 'none'
                      },
                      textTransform: 'none'
                    }}
                    onClick={() => router.push('/apps/utility/user/list')}
                  >
                    {' '}
                    User Master{' '}
                  </Typography>{' '}
                  and assign it to the logged-in user.
                </Typography>
              )}
            </Card>
          </Grid>
        </Grid>

        <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
          <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
            <Typography variant='h6' component='span'>
              Edit Company
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 4, mx: 'auto' }}>
            <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      name='companyName'
                      fullWidth
                      value={editValue.companyName}
                      label='Company Name'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.companyName}
                    />

                    {error && !editValue.companyName && (
                      <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                        Company Name is Required.
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3, marginLeft: { xs: 0, sm: 2 } }}>
                    <TextField
                      name='legalName'
                      fullWidth
                      value={editValue.legalName}
                      label='Legal Name'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.legalName}
                    />

                    {error && !editValue.legalName && (
                      <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                        Legal Name is Required.
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      name='authorizePersonName'
                      fullWidth
                      value={editValue.authorizePersonName}
                      label='Authorize Person Name'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.authorizePersonName}
                    />

                    {error && !editValue.authorizePersonName && (
                      <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                        Authorize Person Name is Required.
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3, marginLeft: { xs: 0, sm: 2 } }}>
                    <TextField
                      name='website'
                      fullWidth
                      value={editValue.website}
                      label='Website'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mb: 3 }}>
                <TextField
                  name='address'
                  fullWidth
                  multiline
                  maxRows={6}
                  value={editValue.address}
                  label='Address'
                  sx={{ mr: [0, 4], mb: [3, 0] }}
                  onChange={handleChange}
                />
              </Box>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      name='email'
                      fullWidth
                      value={editValue.email}
                      label='Email'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3, marginLeft: { xs: 0, sm: 2 } }}>
                    <TextField
                      name='contactNo'
                      fullWidth
                      value={editValue.contactNo}
                      label='Contact No'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3 }}>
                    <TextField
                      name='PAN'
                      fullWidth
                      value={editValue.PAN}
                      label='PAN'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.PAN}
                    />

                    {error && !editValue.PAN && (
                      <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                        PAN is Required.
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ mb: 3, marginLeft: { xs: 0, sm: 2 } }}>
                    <TextField
                      name='GSTIN'
                      fullWidth
                      value={editValue.GSTIN}
                      label='GSTIN'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.GSTIN}
                    />

                    {error && !editValue.GSTIN && (
                      <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                        GSTIN is Required.
                      </FormHelperText>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={6} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={12}>
                  <RadioGroup
                    row
                    aria-label='controlled'
                    name='controlled'
                    value={editValue.status}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel value={1} control={<Radio />} label='Active' />
                    <FormControlLabel value={0} control={<Radio />} label='InActive' />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex' }}>
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
          </DialogContent>
        </Dialog>
        <Spinner loading={showSpinner} />
      </>
    </>
  )
}

export default Company
