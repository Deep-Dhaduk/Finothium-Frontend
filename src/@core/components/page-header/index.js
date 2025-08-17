// ** MUI Imports
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'

const PageHeader = props => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Box  sx={{pt:0}}>
      {title}
      {subtitle || null}
    </Box>
  )
}

export default PageHeader
