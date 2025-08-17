import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { useContext, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { add5_5HoursToDate, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { addAccount } from 'src/api/master/accountMaster'
import { LoadingContext } from 'src/pages/_app'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import * as yup from 'yup'

const schema = yup.object().shape({
  accountName: yup.string().required('Account Name is Required.')
  // accountType: yup.string().required(),
})

const AddAccount = props => {
  const { handleClose, open, setAccountData, activeAccountGroup, activeAccountType, value } = props
  const [radioValue, setRadioValue] = useState(1)
  const [accountType, setAccountType] = useState('')
  const [accountGroup, setAccountGroup] = useState('')
  const [joinDate, setJoinDate] = useState(new Date())
  const [exitDate, setExitDate] = useState(new Date())
  const [error, setError] = useState(false)
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const defaultValues = {
    accountName: '',
    groupName: '',
    joinDate: '',
    exitDate: '',
    accountType: '',
    status: 1
  }

  const handleAcountChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.common_id : ''
    setAccountType(selectedValue)
  }

  const handleAccountGroupChange = (event, newValue) => {
    const selectedValue = newValue ? newValue.common_id : ''
    setAccountGroup(selectedValue)
  }

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues, mode: 'onChange', resolver: yupResolver(schema) })

  const handleRadioChange = event => {
    setRadioValue(event.target.value)
  }

  const onSubmit = async data => {
    try {
      if (!accountType || !accountGroup) {
        setError(true)
      } else {
        setShowSpinner(true)
        setError(false)
        // Handle form submission
        let exitDateToSend = Number(radioValue) === 0 ? add5_5HoursToDate(exitDate) : ''
        const allData = {
          ...data,
          joinDate: joinDate,
          exitDate: exitDateToSend,
          accountType: accountType,
          accountGroup: accountGroup,
          status: radioValue,
          params: { q: value }
        }
        const response = await addAccount(allData)
        setAccountData(response.data)
        if (!response.success) {
          showErrorToast(response.message)
        } else {
          reset()
          handleClose()
          showSuccessToast('Account Saved Successfully.')
        }
      }
    } catch (error) {
      console.error('An error occurred synchronously:', error)
      showErrorToast('An unexpected error occurred. Please try again later.')
    } finally {
      setShowSpinner(false)
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth='sm' onClose={handleClose} open={open}>
        <DialogTitle sx={{ pt: 4, textAlign: 'center' }}>
          <Typography variant='h6' component='span' sx={{ mb: 2 }}>
            Add Account
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 4 }}>
          <Box sx={{ p: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='accountName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Account Name'
                      autoFocus
                      onChange={onChange}
                      error={Boolean(errors.accountName)}
                    />
                  )}
                />
                {errors.accountName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.accountName.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Autocomplete
                  fullWidth
                  value={activeAccountGroup.find(item => item.common_id === accountGroup) || null}
                  onChange={(event, newValue) => handleAccountGroupChange(event, newValue)}
                  options={activeAccountGroup}
                  getOptionLabel={item => item.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Account Group'
                      variant='outlined'
                      error={error && !accountGroup}
                    />
                  )}
                />
                {error && !accountGroup && (
                  <FormHelperText sx={{ color: 'error.main' }}>Please select account group.</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Autocomplete
                  fullWidth
                  value={activeAccountType.find(item => item.common_id === accountType) || null}
                  onChange={(event, newValue) => handleAcountChange(event, newValue)}
                  options={activeAccountType}
                  getOptionLabel={item => item.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Select Account Type'
                      variant='outlined'
                      error={error && !accountType}
                    />
                  )}
                />
                {error && !accountType && (
                  <FormHelperText sx={{ color: 'error.main' }}>Please select account type.</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <DatePickerWrapper>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        selected={joinDate}
                        id='basic-input'
                        dateFormat='d-MMMM-yyyy'
                        popperPlacement={popperPlacement}
                        onChange={date => setJoinDate(date)}
                        placeholderText='Click to select a date'
                        customInput={<CustomInput label='Join Date' />}
                      // error={Boolean(errors.join_date)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {Number(radioValue) === 0 && (
                        <DatePicker
                          selected={
                            exitDate
                              ? new Date(exitDate.getTime())
                              : joinDate
                                ? new Date(joinDate.getTime())
                                : new Date()
                          }
                          id='basic-input'
                          dateFormat='d-MMMM-yyyy'
                          popperPlacement={popperPlacement}
                          onChange={date => setExitDate(date)}
                          placeholderText='Click to select a date'
                          minDate={joinDate ? new Date(joinDate.getTime()) : new Date()}
                          customInput={<CustomInput label='Exit Date' />}
                        // error={Boolean(errors.exit_date)}
                        />
                      )}
                    </Grid>
                    {/* {errors.join_date && <FormHelperText sx={{ color: 'error.main' }}>{errors.join_date.message}</FormHelperText>} */}
                  </Grid>
                </DatePickerWrapper>
              </FormControl>
              <Grid container spacing={6} sx={{ mb: 5 }}>
                <Grid item xs={12} sm={6}>
                  <RadioGroup
                    row
                    aria-label='controlled'
                    name='controlled'
                    value={radioValue}
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
                  onClick={handleClose}
                >
                  <Typography sx={{ display: 'flex', paddingRight: '3px' }}>
                    {' '}
                    <Icon icon={cancelIcon} fontSize={20} />{' '}
                  </Typography>
                  <Typography>Cancel</Typography>
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddAccount
