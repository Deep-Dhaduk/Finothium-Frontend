import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { CustomNoRowsOverlay, formatDateTime, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { deleteClient, fetchClientData, updateClient } from 'src/api/master/clientMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { client } from 'src/varibles/constant'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import TableHeader from 'src/views/master/client/TableHeader'
import Swal from 'sweetalert2'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'clientName',
    minWidth: 240,
    headerName: 'Client Name',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.clientName}</Typography>
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
    minWidth: 215,
    field: 'updatedOn',
    headerName: 'Updated',
    renderCell: ({ row }) => {
      const dateFormate = formatDateTime(row.updatedOn)
      return <Typography variant='paragraph'>{dateFormate}</Typography>
    }
  }
]

const Client = () => {
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)
  const location = useRouter()
  const [titleName, setTitleName] = useState('')
  const [value, setValue] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState({ name: '', status: '' })
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [error, setError] = useState(false)
  const [clientData, setClientData] = useState([])

  const getRowId = row => row.clientId

  const handleChange = e => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
  }

  const handleEditData = row => {
    setEditValue({ id: row.clientId, type: row.type, name: row.clientName, status: row.status })
    setEditDialogOpen(true)
  }
  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleTypeChange = event => {
    setEditValue({
      ...editValue,
      type: event.target.value
    })
  }
  const handleRadioChange = event => {
    setEditValue({
      ...editValue,
      status: event.target.value
    })
  }
  const type = client


  const onSubmit = async e => {
    try {
      e.preventDefault()
      if (!editValue.name) {
        setError(true)
        return
      }
      setShowSpinner(true)
      setEditDialogOpen(false)

      const response = await updateClient(editValue, client, { q: value })
      setClientData(response.data)
      if (!response.success) {
        showErrorToast(response.message)
      } else {
        setEditDialogOpen(false)
        showSuccessToast('Client Updated Successfully.')
      }
    } catch (error) {
      console.error('An error occurred synchronously:', error)
      showErrorToast('An unexpected error occurred. Please try again later.')
    } finally {
      setShowSpinner(false)
    }
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
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
        const response = await deleteClient({ id, type, params: { q: value } })
        setClientData(response.data)

        if (!response.success) {
          showErrorToast(response.message)
        } else {
          showSuccessToast('Client Deleted Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      showErrorToast('An error occurred while deleting the client.')
    } finally {
      setShowSpinner(false)
    }
  }

  const theme = JSON.parse(localStorage.getItem('settings'))

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
          <DarkDeleteButton handleDelete={handleDelete} id={row.clientId} titleName={titleName} />
        </Box>
      )
    },
    ...defaultColumns
  ]

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchClientData({ type: type, params: { q: value } })
      setClientData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    } finally {

      setShowSpinner(false)
    }
  }

  const filterSearchData = async () => {
    try {
      debugger
      const response = await fetchClientData({ type: type, params: { q: value } })
      setClientData(response.data)
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
                filename={'clientData'}
                type={type}
                titleName={titleName}
                clientData={clientData}
                setClientData={setClientData}
              />
              <div className='menu-item-hide'>
                <DataGrid
                  autoHeight
                  rows={clientData}
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
        <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
          <DialogTitle sx={{ pt: 6, textAlign: 'center' }}>
            <Typography variant='h6' component='span' sx={{ mb: 2 }}>
              Edit Client
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 6 }}>
            <Box component='form' sx={{ p: 5 }} onSubmit={onSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  name='name'
                  fullWidth
                  value={editValue.name}
                  label='Client Name'
                  sx={{ mr: [0, 4], mb: [3, 0] }}
                  onChange={handleChange}
                  error={error && !editValue.name}
                />

                {error && !editValue.name && (
                  <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                    Client Name is Required.
                  </FormHelperText>
                )}
              </Box>
              <Grid container spacing={6} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={12}>
                  <RadioGroup
                    row
                    aria-label='controlled'
                    name='controlled'
                    value={editValue.type}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel value={'Both'} control={<Radio />} label='Both (Client & Cateogry)' />
                    <FormControlLabel value={'Client'} control={<Radio />} label='Client only' />
                  </RadioGroup>
                </Grid>
              </Grid>
              <Grid container spacing={6} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6}>
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
          </DialogContent>
        </Dialog>
        <Spinner loading={showSpinner} />
      </>
    </>
  )
}

export default Client
