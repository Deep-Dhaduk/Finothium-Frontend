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
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { formatDateTime, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { deleteCommon, fetchCommonData, updateCommonMenu } from 'src/api/master/commonMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { paymentType } from 'src/varibles/constant'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import TableHeader from 'src/views/master/category-payment-account/TableHeader'
import Swal from 'sweetalert2'
import CommonMenu from '../../components/common-menu/index'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'name',
    minWidth: 240,
    headerName: 'Payment Type Name',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.name}</Typography>
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
      const utcDate = formatDateTime(row.updatedOn)
      return <Typography variant='paragraph'>{utcDate}</Typography>
    }
  }
]

const PaymentType = () => {
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const location = useRouter()
  const [titleName, setTitleName] = useState('')
  const [value, setValue] = useState()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editValue, setEditValue] = useState({ name: '', status: '' })
  const [error, setError] = useState(false)
  const [commonData, setCommonData] = useState([])

  const handleChange = e => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
  }

  const handleEditData = row => {
    setEditValue({ id: row.common_id, type: row.type, name: row.name, status: row.status })
    setEditDialogOpen(true)
  }
  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleRadioChange = event => {
    setEditValue({
      ...editValue,
      status: event.target.value
    })
  }

  const onSubmit = async e => {
    try {
      e.preventDefault()
      if (!editValue.name) {
        setError(true)
        return
      }
      setShowSpinner(true)
      setEditDialogOpen(false)

      const response = await updateCommonMenu(editValue, { q: value })
      setCommonData(response.data)
      if (!response.success) {
        showErrorToast('An error occurred. Please try again later.')
      } else {
        setEditDialogOpen(false)
        showSuccessToast('Payment Type Updated Successfully.')
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
        const allData = { type, id, params: { q: value } }
        const response = await deleteCommon(allData)
        setCommonData(response.data)

        if (!response.success) {
          showErrorToast(response.message)
        } else {
          showSuccessToast('Payment Type Deleted Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      showErrorToast('An error occurred while deleting the payment type.')
    } finally {
      setShowSpinner(false)
    }
  }

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
          <DarkDeleteButton handleDelete={handleDelete} id={row.common_id} titleName={titleName} />
        </Box>
      )
    },
    ...defaultColumns
  ]

  const type = paymentType

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchCommonData({ type: type, params: { q: value } })
      setCommonData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    } finally {
      setShowSpinner(false)
    }
  }

  const filterSerachData = async () => {
    try {
      const response = await fetchCommonData({ type: type, params: { q: value } })
      setCommonData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    }
  }

  useEffect(() => {
    filterSerachData()
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
                filename={'paymentTypeData'}
                handleFilter={handleFilter}
                type={type}
                commonData={commonData}
                titleName={titleName}
                setCommonData={setCommonData}
              />
              <CommonMenu columns={columns} rows={commonData} />
            </Card>
          </Grid>
        </Grid>
        <Dialog maxWidth='sm' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
          <DialogTitle sx={{ pt: 6, textAlign: 'center' }}>
            <Typography variant='h6' component='span' sx={{ mb: 2 }}>
              Edit Payment Type
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 6 }}>
            <Box component='form' sx={{ p: 5 }} onSubmit={onSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  name='name'
                  fullWidth
                  value={editValue.name}
                  label='Payment Type Name'
                  sx={{ mr: [0, 4], mb: [3, 0] }}
                  onChange={handleChange}
                  error={error && !editValue.name}
                />

                {error && !editValue.name && (
                  <FormHelperText variant='body2' sx={{ color: 'error.main' }}>
                    Payment Type is Required.
                  </FormHelperText>
                )}
              </Box>
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

export default PaymentType
