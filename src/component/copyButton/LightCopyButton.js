import { IconButton, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { checkAllowAdd } from 'src/allFunction/commonFunction'
import { getDecodedToken } from 'src/allFunction/commonFunction'
import { copyIcon } from 'src/varibles/icons'

const LightCopyButton = (props) => {
    const { handleCopyData, row, titleName } = props
    const store = useSelector(store => store.roleWisePermission)
    const addVisibility = checkAllowAdd(store.data, titleName)
    const decodedToken = getDecodedToken();

    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>Copy</Typography>}>
                <IconButton sx={{ bgcolor: "secondary.main", borderRadius: "5px", display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "secondary.main" }, color: "white" }} onClick={() => handleCopyData(row)}>
                    <Icon icon={copyIcon} padding="2px" />
                </IconButton>
            </Tooltip> : null}
        </>
    )
}

export default LightCopyButton