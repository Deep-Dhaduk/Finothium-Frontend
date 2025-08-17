import { IconButton, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { checkAllowDelete } from 'src/allFunction/commonFunction'
import { getDecodedToken } from 'src/allFunction/commonFunction';
import { deleteIcon } from 'src/varibles/icons'

const LightDeleteButton = (props) => {
    const { handleDelete, id, titleName } = props
    const decodedToken = getDecodedToken();

    const store = useSelector(store => store.roleWisePermission)

    const addVisibility = checkAllowDelete(store.data, titleName)
    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>Delete</Typography>}>
                <IconButton sx={{ bgcolor: "#FF4D49", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "#FF4D49" }, color: "white" }} onClick={() => handleDelete(id)}>
                    <Icon icon={deleteIcon} />
                </IconButton>
            </Tooltip> : null}
        </>
    )
}

export default LightDeleteButton