// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { rupeeSymbol } from 'src/varibles/icons'

// ** Custom Components Imports

const TotalReceive = (props) => {
  const { rows } = props

  return (
    <Card cursor="pointer">
      <CardHeader title='Total Receive' />
      <CardContent>
        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
          <Icon icon={rupeeSymbol} fontSize={20} />
          <Typography sx={{ color: 'info.main' }} variant='body2' fontSize={20}>{rows ? rows : 0}</Typography>
        </Box>
        {/* </Box> */}
      </CardContent>
    </Card>
  )
}

export default TotalReceive