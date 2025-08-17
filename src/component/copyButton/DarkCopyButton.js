import { IconButton } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppTooltip, checkAllowAdd } from 'src/allFunction/commonFunction'
import { copyIcon } from 'src/varibles/icons'
import { getDecodedToken } from 'src/allFunction/commonFunction';

const DarkCopyButton = (props) => {
    const { handleCopyData, row, titleName, title } = props
    const store = useSelector(store => store.roleWisePermission)
    const decodedToken = getDecodedToken();


    const copyData = () => {
        handleCopyData(row)
    }

    const addVisibility = checkAllowAdd(store.data, titleName)

    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <AppTooltip placement='top' title="Copy">
                <IconButton sx={{ bgcolor: "secondary.main", borderRadius: "5px", display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "secondary.main" }, color: "white" }} onClick={copyData}>
                    <Icon icon={copyIcon} padding="2px" />
                </IconButton>
            </AppTooltip> : null}
        </>
    )
}

export default DarkCopyButton