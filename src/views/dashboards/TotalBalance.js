// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { rupeeSymbol } from 'src/varibles/icons'
import { cardTextColor } from 'src/allFunction/commonFunction'


const TotalBalance = (props) => {
    const { rows } = props
    const textColor = cardTextColor(rows);
    return (
        <Card>
            <CardHeader title='Balance' />
            <CardContent>
                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                <Box sx={{ display: 'flex', alignItems: 'center', color: textColor }}>
                    <Icon icon={rupeeSymbol} fontSize={20} />
                    <Typography sx={{ color: textColor }} variant='body2' fontSize={20}>{rows ? rows : 0}</Typography>

                </Box>
                {/* </Box> */}
            </CardContent>
        </Card>
    )
}

export default TotalBalance