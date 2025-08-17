// ** React Imports
import { useCallback, useContext, useEffect, useState } from 'react'

// ** Next Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { deleteUser, fetchUserData, updateUser } from 'src/api/utility/usermaster'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Button, Checkbox, FormControlLabel, FormHelperText, InputAdornment, ListItemText, Radio, RadioGroup, TextField } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import PageHeader from 'src/@core/components/page-header'
import { AppTooltip, CustomNoRowsOverlay, formatDateTime, getDecodedToken, getDecodedTokenValue, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { fetchActiveCompanyData } from 'src/api/active/companyActive'
import { fetchActiveRoleData } from 'src/api/active/roleActive'
import { resetPassword } from 'src/api/utility/usermaster'
import DarkDeleteButton from 'src/component/deleteButton/DarkDeleteButton'
import DarkEditButton from 'src/component/editButton/DarkEditButton'
import Spinner from 'src/component/spinner'
import { useAuth } from 'src/hooks/useAuth'
import { LoadingContext } from 'src/pages/_app'
import { adminRoleName, superAdminRoleName } from 'src/varibles/constant'
import { cancelIcon, eyeIcon, eyeLockIcon, userResetPassword, resetPasswordIcon, saveIcon } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import Swal from 'sweetalert2'

import * as yup from 'yup'
const Avatar = dynamic(() => import('react-avatar-edit'), { ssr: false });

// ** renders client column
const renderClient = row => {
  if (row.profile_image_filename !== null && row.profile_image_filename !== '') {
    return <img
      src={row.profile_image_filename}
      alt="Profile"
      style={{ marginRight: '10px', width: '34px', height: '34px', borderRadius: '50%' }}
    />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.fullname ? row.fullname.toUpperCase() : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const defaultColumns = [
  {
    flex: 0.2,
    minWidth: 210,
    field: 'fullname',
    headerName: 'User',
    renderCell: ({ row }) => {
      const { fullname, forcePasswordChange } = row

      return (
        // <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        //   <Box>
        //     {renderClient(row)}
        //   </Box>
        //   <Typography>{fullname}</Typography>
        //   <Box >
        //     {forcePasswordChange === 1 &&
        //       <AppTooltip title="This User has not changed their default password yet." placement="top">
        //         <Typography sx={{ color: 'warning.dark', ml: 5, display: 'flex', alignItems: 'center' }}><Icon icon={userResetPassword} fontSize={16} /></Typography>
        //       </AppTooltip>}
        //   </Box>
        // </Box>
        <Grid container>
          <Grid item xs={2} sm={2}> {renderClient(row)}</Grid>
          <Grid item xs={8} sm={8} sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ ml: 3 }}>{fullname}</Typography></Grid>
          <Grid item xs={2} sm={2} sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {forcePasswordChange === 1 &&
                <AppTooltip title="This User has not changed their default password yet." placement="top">
                  <Typography sx={{ color: 'warning.dark', ml: 5, display: 'flex', alignItems: 'center' }}><Icon icon={userResetPassword} fontSize={16} /></Typography>
                </AppTooltip>}
            </Box>
          </Grid>
        </Grid>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 220,
    field: 'email',
    headerName: 'Email',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='paragraph'>
          {row.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'roleName',
    minWidth: 100,
    headerName: 'Role',
    renderCell: ({ row }) => <Typography variant='paragraph'>{row.roleName}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 150,
    headerName: 'Company',
    field: 'companyNames',
    renderCell: ({ row }) => (
      <Typography variant='paragraph' noWrap sx={{ textTransform: 'capitalize' }}>
        {row.companyNames}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }) => <Typography variant='paragraph' style={{ color: row.status === 1 ? '#72E128' : '#FF4D49' }}>{row.status === 1 ? "Active" : "InActive"}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 150,
    field: 'updatedOn',
    headerName: 'Updated',
    renderCell: ({ row }) => {
      const utcTime = formatDateTime(row.updatedOn)
      return <Typography variant='paragraph'>{utcTime}</Typography>
    }
  },
]

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required("New Password is Required.")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/,
      "Password must be between 8 and 20 characters, include at least 1 uppercase letter, 1 digit, and 1 special character."
    )
    .min(8, 'Password must be at least 8 characters.'),

  confirmPassword: yup
    .string()
    .required("Confirm Password is Required.")
    .oneOf([yup.ref('newPassword'), null], 'New Password and Confirm Password must be same.'),
})

const defaultValues = {
  newPassword: '',
  confirmPassword: ''
}

const UserList = () => {
  const location = useRouter()
  const [titleName, setTitleName] = useState('')
  const [value, setValue] = useState('')
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState('');
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [activeRole, setActiveRole] = useState([]);
  const [activeCompany, setActiveCompany] = useState([]);
  const [editValue, setEditValue] = useState({
    userName: '',
    fullName: '',
    profile_image: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    company: '',
    status: '',
  })
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState([])
  const [error, setError] = useState(false);

  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const handleToggleNewPassword = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRoleChange = (event, newValue) => {
    const selectedId = newValue ? newValue.id : '';
    setEditValue((prevValue) => ({
      ...prevValue,
      role: selectedId,
    }));
  };

  const { reset, control, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const handleCheckBoxChange = (event, newValue) => {
    const selectedIds = newValue.map((option) => option.id);
    setSelectedCompanyIds(selectedIds);
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
        const response = await deleteUser(data);
        setUserData(response.data)
        if (!response.success) {
          showErrorToast(response.message);
        } else {
          showSuccessToast("User Deleted Successfully.");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showErrorToast("An error occurred while deleting the user.");
    } finally {
      setShowSpinner(false);
    }
  };


  const handleResetPassword = () => setOpen(!open)

  const onClose = () => {
    setPreview('');
  };

  const onCrop = (newPreview) => {
    setPreview(newPreview);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 100000) {
      showErrorToast("File is too big!");
      elem.target.value = "";
    }
  };

  const theme = JSON.parse(localStorage.getItem("settings"))

  const auth = useAuth()

  const columns = [
    {
      flex: 0.15,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        const superAdminCount = userData.filter(user => user.roleName.toLowerCase() === superAdminRoleName).length;
        const adminCount = userData.filter(user => user.roleName.toLowerCase() === adminRoleName).length;
        const loginUser = userData.find(user => user.id === auth.user.id)

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <DarkEditButton handleEditData={handleEditData} row={row} titleName={titleName} />
            {
              row.id !== auth.user.id ?
                (row.roleName.toLowerCase() === adminRoleName &&
                  adminCount >= 2) || (row.roleName.toLowerCase() === superAdminRoleName &&
                    superAdminCount >= 2) ?
                  <DarkDeleteButton handleDelete={handleDelete} id={row.id} titleName={titleName} /> :
                  (row.roleName.toLowerCase() !== adminRoleName && row.roleName.toLowerCase() !== superAdminRoleName) &&
                  <DarkDeleteButton handleDelete={handleDelete} id={row.id} titleName={titleName} /> :
                null
            }
          </Box>
        )
      }

    },
    ...defaultColumns,
  ].map(column => {
    if (column.field === 'companyNames') {
      return {
        ...column,
        renderCell: (params) => (
          <AppTooltip placement='top' title={params.row.companyNames}>
            <Typography variant='paragraph'>{params.row.companyNames}</Typography>
          </AppTooltip>
        ),
      };
    }
    return column;
  });

  const router = useRouter()


  const handleEditData = (row) => {
    setEditDialogOpen(true)
    const companyIds = row.companies.map(item => item.companyId)
    setEditValue({ id: row.id, userName: row.username, fullName: row.fullname, profile_image: row.profile_image_filename, email: row.email, role: row.roleId, password: row.password, confirmpassword: row.confirmpassword, company: companyIds, status: row.status })
  }

  const handleChange = (e) => {
    setEditValue({ ...editValue, [e.target.name]: e.target.value })
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)
  const handleResetPassDialogToggle = () => {
    setOpen(!open)
    reset()
  }

  const handleDataSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!editValue.email || !editValue.fullName || !editValue.userName || selectedCompanyIds.length === 0 || !editValue.role) {
        setError(true);
        return;
      }
      const isCompanyArrayDifferent = JSON.stringify(selectedCompanyIds) !== JSON.stringify(editValue.company);
      const user = JSON.parse(localStorage.getItem("userData"));

      if (isCompanyArrayDifferent && editValue.id === user.id) {
        setEditDialogOpen(false)
        Swal.fire({
          title: "Are you sure?",
          text: "You changing the logged-in User's Company access that requires automatic logged out!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Change it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            setShowSpinner(true);
            const allData = { ...editValue, company: selectedCompanyIds, profile_image: preview };

            const response = await updateUser(allData, { q: value });
            setUserData(response.data)
            if (!response.success) {
              showErrorToast(response.message);
            } else {
              setEditDialogOpen(false);
              showSuccessToast("User Updated Successfully.");
              localStorage.removeItem('userData')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('accessToken')
              router.push('/login')
              window.location.reload()
            }
          } else {
            setEditDialogOpen(true)
          }
        });
      } else {
        setShowSpinner(true);
        const allData = { ...editValue, company: selectedCompanyIds, profile_image: preview };

        const response = await updateUser(allData, { q: value });
        setUserData(response.data)

        if (!response.success) {
          showErrorToast(response.message);
        } else {
          showSuccessToast("User Updated Successfully.");
          setEditDialogOpen(false);
        }
      }


    } catch (error) {

      console.error("An error occurred synchronously:", error);
      showErrorToast("An unexpected error occurred. Please try again later.");
    } finally {
      setShowSpinner(false);

    }
  };

  const onSubmit = async (data) => {
    try {
      const allData = { ...data, id: editValue.id };
      const response = await resetPassword(allData, { q: value });
      setUserData(response.data)
      if (response.success) {
        showSuccessToast("User Password has been Reset Successfully.");
        handleResetPassDialogToggle();
      }
    } catch (error) {
      showErrorToast("Error resetting password.");
      console.error(error);
    }
    reset()
  };

  const handleRadioChange = (event) => {
    setEditValue({
      ...editValue,
      status: event.target.value,
    });
  }

  const fetchData = async () => {
    try {
      setShowSpinner(true);
      const response = await fetchUserData()
      setUserData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error);
    } finally {
      setShowSpinner(false);
    }
  };

  const fetchActiveRole = async () => {
    const response = await fetchActiveRoleData()
    setActiveRole(response.data)
  }

  const fetchActiveCompany = async () => {
    const response = await fetchActiveCompanyData()
    setActiveCompany(response.data)
  }

  const filterSearchData = async () => {
    try {
      const response = await fetchUserData({ q: value })
      setUserData(response.data)
    } catch (error) {
      console.error(`Error fetching ${titleName} data:`, error);
    }
  }

  const { companyName } = getDecodedTokenValue()

  useEffect(() => {
    if (editValue.company) {
      setSelectedCompanyIds(editValue.company);
    }
  }, [editValue]);

  useEffect(() => {
    filterSearchData()
  }, [value])

  useEffect(() => {
    const navSetting = navAllChildren.find(x => x.path === location.pathname)
    const title = navSetting.title ?? ''
    setTitleName(title)
    fetchData();
    fetchActiveRole()
    fetchActiveCompany()
  }, [])

  return (
    <>

      <Grid container spacing={6}>
        <Grid item xs={12} className='module-heading'>
          <PageHeader
            title={<Typography variant='h6'>{titleName}</Typography>}
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} data={userData} titleName={titleName} setUserData={setUserData} activeRole={activeRole} activeCompany={activeCompany} />
            <div className="menu-item-hide">
              <DataGrid
                autoHeight
                rows={userData}
                columns={columns}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={pageSizeLength}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                components={{
                  NoRowsOverlay: CustomNoRowsOverlay,
                }}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              />
            </div>
            <Typography variant='paragraph' sx={{
              backgroundColor: theme.mode === 'dark' ? '#3A3E5B' : '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', p: 2, color: 'error.main',
              fontSize: 14
            }}
            > Note: Only Users are visible in the User Master who have access to the logged-in company ({companyName}).
            </Typography>

          </Card>
        </Grid>


        <Dialog maxWidth='md' fullWidth onClose={handleDialogToggle} open={editDialogOpen}>
          <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
            <Typography variant='h6' component='span'>
              Edit User
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 4 }}>
            <Box component='form' sx={{ p: 2 }} onSubmit={handleDataSubmit}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>

              </Box>
              <Grid container>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <TextField
                          name='userName'
                          fullWidth
                          value={editValue.userName}
                          label='UserName'
                          sx={{ mr: [0, 4], mb: [3, 0] }}
                          onChange={handleChange}
                          error={error & !editValue.userName}
                        />
                        {error && !editValue.userName && <FormHelperText variant="body2" sx={{ color: "error.main" }}>User Name is Required</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                          name='fullName'
                          fullWidth
                          value={editValue.fullName}
                          label='Full Name'
                          sx={{ mr: [0, 4], mb: [3, 0] }}
                          onChange={handleChange}
                          error={error & !editValue.fullName}
                        />
                        {error && !editValue.fullName && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Full Name is Required.</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ mb: 6 }}>
                    <TextField
                      name='email'
                      fullWidth
                      value={editValue.email}
                      label='Email'
                      sx={{ mr: [0, 4], mb: [3, 0] }}
                      onChange={handleChange}
                      error={error && !editValue.email}
                    />
                    {error && !editValue.email && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Email is Required.</FormHelperText>}
                  </Box>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Autocomplete
                      fullWidth
                      value={activeRole.find((role) => role.id === editValue.role) || null}
                      disabled={userData.length == 1}
                      onChange={(event, newValue) => { handleRoleChange(event, newValue); setError(false) }}
                      options={activeRole}
                      getOptionLabel={(role) => role.rolename}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Role" variant="outlined" error={error && !editValue.role} />
                      )}
                    />
                    {error && !editValue.role && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Role.</FormHelperText>}
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <Autocomplete
                      fullWidth
                      multiple
                      id="demo-multiple-checkbox"
                      value={activeCompany.filter((company) => selectedCompanyIds.includes(company.id))}
                      onChange={(event, newValue) => handleCheckBoxChange(event, newValue)}
                      options={activeCompany}
                      getOptionLabel={(option) => option.company_name}
                      renderInput={(params) => (
                        <TextField {...params} label="Company Name" variant="outlined" error={error && selectedCompanyIds.length === 0} />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} />
                          <ListItemText primary={option.company_name} />
                        </li>
                      )}
                    />
                    {error && selectedCompanyIds.length === 0 && <FormHelperText variant="body2" sx={{ color: "error.main" }}>Please Select Company.</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid className='profile-avatar' item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Avatar
                    className="round-avatar"
                    width={250}
                    height={250}
                    onCrop={onCrop}
                    onClose={onClose}
                    cropRadius={125}
                    onBeforeFileLoad={onBeforeFileLoad}
                    src={editValue.profile_image}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={12}>
                  <RadioGroup row aria-label='controlled' name='controlled' value={editValue.status} onChange={handleRadioChange}>
                    <FormControlLabel value={1} control={<Radio disabled={userData.length == 1} />} label='Active' />
                    <FormControlLabel value={0} control={<Radio disabled={userData.length == 1} />} label='InActive' />
                  </RadioGroup>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexFlow: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: "flex" }}>
                  <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} fontSize={20} /></Typography>
                    <Typography sx={{ color: "white" }}>Save</Typography>
                  </Button>
                  <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleDialogToggle}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                    <Typography>Cancel</Typography>
                  </Button>
                </Box>
                <Box>
                  <Button variant='contained' color='error' onClick={handleResetPassword} sx={{ color: '#FF4D49', cursor: "pointer" }}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={resetPasswordIcon} /> </Typography>
                    <Typography>Reset Password</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        <Dialog fullWidth maxWidth='sm' onClose={handleResetPassDialogToggle} open={open}>
          <DialogTitle sx={{ pt: 4, mx: 'auto', textAlign: 'center' }}>
            <Typography variant='h6' component='span' sx={{ mb: 2 }}>
              Reset Password
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 4 }}>
            <Box sx={{ p: 2 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl fullWidth sx={{ mb: 3 }}>

                  <Controller
                    name='newPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        type={showNewPassword ? 'text' : 'password'}
                        label="New Password"
                        onChange={onChange}
                        error={Boolean(errors.newPassword)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleToggleNewPassword} edge='end'>
                                {showNewPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  {errors.newPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>}
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>

                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        onChange={onChange}
                        error={Boolean(errors.confirmPassword)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleToggleConfirmPassword} edge='end'>
                                {showConfirmPassword ? <Icon icon={eyeIcon} /> : <Icon icon={eyeLockIcon} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  {errors.confirmPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>}
                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} /></Typography>
                    <Typography sx={{ color: "white" }}>Save</Typography>
                  </Button>
                  <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleResetPassDialogToggle}>
                    <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
                    <Typography>Cancel</Typography>
                  </Button>
                </Box>
              </form>
            </Box>
          </DialogContent>
        </Dialog>
        <Spinner loading={showSpinner} />


      </Grid>
    </>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList
