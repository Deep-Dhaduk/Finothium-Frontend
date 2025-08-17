import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
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
  CustomNoRowsOverlay,
  formatDate,
  formatDateTime,
  showErrorToast,
  showSuccessToast
} from 'src/allFunction/commonFunction'
import { fetchActiveAccountGroupData } from 'src/api/active/accountgroupActive'
import { fetchActiveCommonData } from 'src/api/active/commonActive'
import { deleteAccount, fetchAccountData, updateAccount } from 'src/api/master/accountMaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { LoadingContext } from 'src/pages/_app'
import { account_Group, account_Type } from 'src/varibles/constant'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import TableHeader from 'src/views/master/account/TableHeader'
import Swal from 'sweetalert2'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'account_name',
    minWidth: 150,
    headerName: 'Account Name',
    renderCell: ({ row }) => {
      return <Typography variant='paragraph'>{row.account_name}</Typography>
    }
  },
  {
    flex: 0.25,
    field: 'group_name',
    minWidth: 150,
    headerName: 'Group Name',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.group_name}</Typography>
  },
  {
    flex: 0.25,
    field: 'join_date',
    minWidth: 130,
    headerName: 'Join Date',
    renderCell: ({ row }) => {
      const utcDate = formatDate(row.join_date)
      return <Typography variant='paragraph'>{utcDate}</Typography>
    }
  },
  {
    flex: 0.25,
    field: 'exit_date',
    minWidth: 130,
    headerName: 'Exit Date',
    renderCell: ({ row }) => {
      const utcDate = formatDate(row.exit_date)
      return <Typography variant='paragraph'>{utcDate}</Typography>
    }
  },
  {
    flex: 0.25,
    field: 'account_type_name',
    minWidth: 150,
    headerName: 'Account Type',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.account_type_name}</Typography>
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
    minWidth: 150,
    field: 'updatedOn',
    headerName: 'Updated',
    renderCell: ({ row }) => {
      const utcDate = formatDateTime(row.updatedOn)
      return <Typography variant='paragraph'>{utcDate}</Typography>
    }
  }
]

const Account = () => {
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const location = useRouter()
  const [titleName, setTitleName] = useState('')

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [error, setError] = useState(false)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [accountData, setAccountData] = useState([])
  const [editValue, setEditValue] = useState({
    id: '',
    account_name: '',
    group_name_Id: '',
    join_date: '',
    exit_date: '',
    account_type_Id: '',
    status: ''
  })
  const [joinDate, setJoinDate] = useState(null)
  const [exitDate, setExitDate] = useState('')
  const [value, setValue] = useState()
  const [activeAccountGroup, setActiveAccountGroup] = useState([])
  const [activeAccountType, setActiveAccountType] = useState([])

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const getRowId = row => row.account_id

  const handleChange = e => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const handleEditData = data => {
    setJoinDate(new Date(data.join_date))
    {
      data.exit_date !== '' && setExitDate(new Date(data.exit_date))
    }
    setEditValue({
      id: data.account_id,
      account_name: data.account_name,
      group_name_Id: data.group_name_Id,
      join_date: joinDate,
      exit_date: exitDate,
      account_type_Id: data.account_type_Id,
      status: data.status
    })
    setEditDialogOpen(true)
  }

  const handleRadioChange = event => {
    setEditValue({ ...editValue, status: Number(event.target.value) })
  }

  const accountGroupChange = (newValue) => {
    const selectedValue = newValue ? newValue.common_id : ''
    setEditValue(prevValue => ({
      ...prevValue,
      group_name_Id: selectedValue
    }))
  }

  const handleAcountChange = (newValue) => {
    const selectedValue = newValue ? newValue.common_id : ''

    setEditValue(prevValue => ({
      ...prevValue,
      account_type_Id: selectedValue
    }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    if (!editValue.group_name_Id || !editValue.account_type_Id || !editValue.account_name || !joinDate) {
      setError(true)
      return
    }
    setShowSpinner(true)
    try {
      const data = { ...editValue, joinDate, exitDate: Number(editValue.status) === 1 ? '' : exitDate }
      const allData = {
        ...data,
        exitDate: data.status === 0 && data.exitDate === '' ? new Date() : data.exitDate !== '' ? data.exitDate : ''
      }
      const response = await updateAccount(allData, { q: value })
      setAccountData(response.data)
      if (!response.success) {
        showErrorToast(response.message)
      } else {
        showSuccessToast('Account Updated Successfully.')
      }
    } catch (error) {
      console.error('An error occurred asynchronously:', error)
      showErrorToast('An unexpected error occurred. Please try again later.')
    } finally {
      setEditDialogOpen(false)
      setJoinDate()
      setExitDate('')
      setShowSpinner(false)
    }
    setError(false)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
    setError(false)
    setJoinDate()
    setExitDate('')
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
        const allData = { id, params: { q: value } }
        const response = await deleteAccount(allData)
        setAccountData(response.data)
        if (!response.success) {
          showErrorToast(response.message)
        } else {
          showSuccessToast('Account Deleted Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred:', error)
      showErrorToast('An error occurred while deleting the account.')
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
          <DarkDeleteButton handleDelete={handleDelete} id={row.account_id} titleName={titleName} />
        </Box>
      )
    },
    ...defaultColumns
  ]

  const fetchActiveAccountGroup = async () => {
    const response = await fetchActiveAccountGroupData({ type: account_Group })
    setActiveAccountGroup(response.data)
  }
  const fetchActiveAccountType = async () => {
    const response = await fetchActiveCommonData({ type: account_Type })
    setActiveAccountType(response.data)
  }

  const fetchData = async () => {
    try {
      setShowSpinner(true)
      const response = await fetchAccountData({ q: value })
      setAccountData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error)
    } finally {
      setShowSpinner(false)
    }
  }

  const filterSearchData = async () => {
    try {
      const response = await fetchAccountData({ q: value })
      setAccountData(response.data)
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
    fetchActiveAccountType()
    fetchActiveAccountGroup()
  }, [])

  return (
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
              accountData={accountData}
              titleName={titleName}
              setAccountData={setAccountData}
              activeAccountGroup={activeAccountGroup}
              activeAccountType={activeAccountType}
            />
            <div className='menu-item-hide'>
              <DataGrid
                autoHeight
                rows={accountData}
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
            Edit Account
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 6 }}>
          <Box component='form' sx={{ p: 2 }} onSubmit={onSubmit}>
            <Box fullWidth sx={{ mb: 6 }}>
              <TextField
                name='account_name'
                fullWidth
                value={editValue.account_name}
                label='Account Name'
                sx={{ mr: [0, 4], mb: [3, 0] }}
                onChange={handleChange}
                error={error && !editValue.account_name}
              />
              {error && !editValue.account_name && (
                <FormHelperText sx={{ color: 'error.main' }}>Please Select Account Name.</FormHelperText>
              )}
            </Box>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete
                fullWidth
                value={activeAccountGroup.find(item => item.common_id === editValue.group_name_Id) || null}
                onChange={(event, newValue) => accountGroupChange(event, newValue)}
                options={activeAccountGroup}
                getOptionLabel={item => item.name}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Select Account Group'
                    variant='outlined'
                    error={error && !editValue.group_name_Id}
                  />
                )}
              />
              {error && !editValue.group_name_Id && (
                <FormHelperText sx={{ color: 'error.main' }}>Please Select Account Group.</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete
                fullWidth
                value={activeAccountType.find(item => item.common_id === editValue.account_type_Id) || null}
                onChange={(event, newValue) => handleAcountChange(event, newValue)}
                options={activeAccountType}
                getOptionLabel={item => item.name}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Select Account Type'
                    variant='outlined'
                    error={error && !editValue.account_type_Id}
                  />
                )}
              />
              {error && !editValue.account_type_Id && (
                <FormHelperText sx={{ color: 'error.main' }}>Please Select Account Type.</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <DatePickerWrapper>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      selected={joinDate}
                      id='basic-input'
                      popperPlacement={popperPlacement}
                      dateFormat='d-MMMM-yyyy'
                      onChange={date => setJoinDate(date)}
                      placeholderText='Click to select a date'
                      customInput={<CustomInput label='Join Date' error={error && !joinDate} />}
                    />
                    {error && !joinDate && (
                      <FormHelperText sx={{ color: 'error.main' }} variant='paragraph'>
                        Please Select Join Date.
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {editValue.status === 0 && (
                      <DatePicker
                        selected={exitDate ? new Date(exitDate.getTime()) : new Date()}
                        id='basic-input'
                        popperPlacement={popperPlacement}
                        dateFormat='d-MMMM-yyyy'
                        onChange={date => setExitDate(date)}
                        placeholderText='Click to select a date'
                        minDate={joinDate ? new Date(joinDate.getTime()) : new Date()}
                        customInput={<CustomInput label='Exit Date' />}
                      />
                    )}
                  </Grid>
                </Grid>
              </DatePickerWrapper>
            </FormControl>
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
  )
}

export default Account
