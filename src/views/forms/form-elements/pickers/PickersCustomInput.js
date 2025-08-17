// ** React Imports
import { forwardRef } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'

const PickersComponent = forwardRef(({ ...props }, ref) => {
  // ** Props
  const { label, readOnly, error } = props

  return (
    <TextField fullWidth inputRef={ref} error={error} {...props} label={label || ''} {...(readOnly && { inputProps: { readOnly: true } })} />
  )
})

export default PickersComponent
