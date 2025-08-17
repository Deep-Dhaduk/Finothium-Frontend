// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import { rupeeSymbol } from 'src/varibles/icons'


const TotalPaid = (props) => {
    const { rows } = props
    return (
        <Card>
            <CardHeader title='Total Paid' />
            <CardContent>
                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                    <Icon icon={rupeeSymbol} fontSize={20} />
                    <Typography sx={{ color: 'warning.main' }} variant='body2' fontSize={20}>{rows ? rows : 0}</Typography>
                </Box>
                {/* </Box> */}
            </CardContent>
        </Card >
    )
}

export default TotalPaid