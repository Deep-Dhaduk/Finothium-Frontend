import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import dynamic from 'next/dynamic'
import React, { useContext, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addUser } from 'src/api/utility/usermaster'
import { LoadingContext } from 'src/pages/_app'
import { cancelIcon, eyeIcon, eyeLockIcon, saveIcon } from 'src/varibles/icons'
import * as yup from 'yup'


const Avatar = dynamic(() => import('react-avatar-edit'), { ssr: false });

const schema = yup.object().shape({
  userName: yup.string().required('User Name is Required.'),
  fullName: yup.string().required('Full Name is Required.'),
  email: yup.string().email('Invalid Email.').required('Email is Required.'),
  password: yup
    .string()
    .required("Password is Required.")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/,
      "Password must be between 8 and 20 characters, include at least 1 uppercase letter, 1 digit, and 1 special character."
    )
    .min(8, 'Password must be at least 8 characters.'),

  confirmPassword: yup
    .string()
    .required("Confirm Password is Required.")
    .oneOf([yup.ref('password'), null], 'Password and Confirm Password must be same.'),
});


const AddUser = (props) => {

  const { handleClose, open, setUserData, activeRole, activeCompany, value } = props
  const [radioValue, setRadioValue] = useState(1)
  const [role, setRole] = React.useState('');
  const [companyName, setCompanyName] = React.useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [preview, setPreview] = useState('');
  const [src, setSrc] = useState('');
  const [error, setError] = useState(false);
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const handleSelectChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.id : '';
    setRole(selectedValue);
  };

  const handleCheckBoxChange = (event, newValue) => {
    const selectedIds = newValue.map((option) => option.id);
    setCompanyName(selectedIds);
  };

  const defaultValues = {
    userName: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: '',
    role: '',
    company: [''],
    status: ''
  }
  const dispatch = useDispatch();

  const { reset, control, setValue, handleSubmit, formState: { errors } } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const handleRadioChange = event => {
    setRadioValue(event.target.value)
  }

  const onSubmit = async (data) => {
    try {
      if (!role || companyName.length === 0) {
        setError(true)
      } else {
        setShowSpinner(true);
        setError(false)
        const allData = { ...data, role: role, profile_image: preview, company: companyName, status: radioValue, params: { q: value } };
        const response = await addUser(allData);
        setUserData(response.data)
        if (response.success) {
          showSuccessToast("User Saved Successfully.");
          reset();
          handleClose();
        } else {
          showErrorToast(response.message);
        }
      }

    } catch (error) {
      console.error("An error occurred synchronously:", error);
      showErrorToast("An unexpected error occurred. Please try again later.");
    } finally {
      setShowSpinner(false);
    }
  };

  const onClose = () => {
    setPreview(null);
  };

  const onCrop = (croppedPreview) => {
    setPreview(croppedPreview);
  };

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 1000000) {
      showErrorToast('File is too big!');
      elem.target.value = '';
    }
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Dialog fullWidth maxWidth='md' onClose={handleClose} open={open}>
        <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
          <Typography variant='h6' component='span' sx={{ mb: 2 }}>
            Add User
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 4 }}>
          <Box sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container>
                <Grid item xs={12} sm={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2, }}>
                        <Controller
                          name='userName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              autoFocus
                              label='User Name'
                              onChange={onChange}
                              error={Boolean(errors.userName)}
                            />
                          )}
                        />
                        {errors.userName && <FormHelperText sx={{ color: 'error.main' }}>{errors.userName.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='fullName'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              label='Full Name'
                              onChange={onChange}
                              error={Boolean(errors.fullName)}
                            />
                          )}
                        />
                        {errors.fullName && <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          value={value.toLocaleLowerCase()}
                          label='Email'
                          onChange={onChange}
                          error={Boolean(errors.email)}
                        />
                      )}
                    />
                    {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                  </FormControl>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Controller
                          name='password'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              type={showNewPassword ? 'text' : 'password'}
                              label='Password'
                              onChange={onChange}
                              error={Boolean(errors.password)}
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
                        {errors.password && <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='confirmPassword'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              value={value}
                              type={showConfirmPassword ? 'text' : 'password'}
                              label='Confirm Password'
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
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Autocomplete
                          fullWidth
                          value={activeRole.find((item) => item.id === role) || null}
                          onChange={(event, newValue) => handleSelectChange(event, newValue)}
                          options={activeRole}
                          getOptionLabel={(item) => item.rolename}
                          renderInput={(params) => (
                            <TextField {...params} label="Select Role" variant="outlined" error={error && !role} />
                          )}
                        />
                        {error && !role && <FormHelperText sx={{ color: 'error.main' }}>Please Select Role.</FormHelperText>}
                        {/* {errors.role && <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>} */}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Autocomplete
                          fullWidth
                          multiple
                          id="demo-multiple-checkbox"
                          value={activeCompany.filter((company) => companyName.includes(company.id))}
                          onChange={(event, newValue) => handleCheckBoxChange(event, newValue)}
                          options={activeCompany}
                          getOptionLabel={(option) => option.company_name}
                          renderInput={(params) => (
                            <TextField {...params} label="Company Name" variant="outlined" error={error && companyName.length === 0} />
                          )}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox checked={selected} />
                              {option.company_name}
                            </li>
                          )}
                        />
                        {error && companyName.length === 0 && <FormHelperText sx={{ color: 'error.main' }}>Please Select Company Name.</FormHelperText>}
                        {/* {errors.company && <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>} */}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className='profile-avatar' item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Avatar
                    className="round-avatar"
                    width={200}
                    height={200}
                    onCrop={onCrop}
                    onClose={onClose}
                    onBeforeFileLoad={onBeforeFileLoad}
                    src={src}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={6} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6}>
                  <RadioGroup row aria-label='controlled' name='controlled' value={radioValue} onChange={handleRadioChange}>
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
                <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleClose}>
                  <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} fontSize={20} /> </Typography>
                  <Typography>Cancel</Typography>
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog >
    </>
  )
}


export default AddUser