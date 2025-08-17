import { IconButton, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { checkAllowEdit } from 'src/allFunction/commonFunction'
import { getDecodedToken } from 'src/allFunction/commonFunction';
import { editIcon } from 'src/varibles/icons'

const LightEditButton = (props) => {
    const { handleEditData, row, titleName } = props
    const decodedToken = getDecodedToken();

    const store = useSelector(store => store.roleWisePermission)


    const addVisibility = checkAllowEdit(store.data, titleName)

    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>Edit</Typography>}>
                <IconButton sx={{ bgcolor: "#F59E0B", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "#FDB528" }, color: "white" }} onClick={() => handleEditData(row)}>
                    <Icon icon={editIcon} />
                </IconButton>
            </Tooltip> : null}
        </>
    )
}

export default LightEditButton