// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import AddRole from './AddRole'


const RolesCards = (props) => {
  // ** States
  const [open, setOpen] = useState(false)

  const { renderCards } = props

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen()
          }}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img width={65} height={130} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    sx={{ mb: 2.5, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      handleClickOpen()
                    }}
                  >
                    Add Role
                  </Button>
                  <Typography variant='body2'>Add role, if it doesn't exist.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      {open && <AddRole open={open} handleClose={handleClose} />}
    </Grid>
  )
}

export default RolesCards
