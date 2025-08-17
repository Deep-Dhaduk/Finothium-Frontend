import { IconButton } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { getDecodedToken } from 'src/allFunction/commonFunction';
import { AppTooltip, checkAllowEdit } from 'src/allFunction/commonFunction'

const DarkEditButton = (props) => {
    const { handleEditData, row, titleName } = props
    const decodedToken = getDecodedToken();

    const store = useSelector(store => store.roleWisePermission)

    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(fetchMenuData())
    // }, [])


    const addVisibility = checkAllowEdit(store.data, titleName)
    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <AppTooltip placement='top' title="Edit">
                <IconButton sx={{ bgcolor: "#FDB528", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "#FDB528" }, color: "white" }} onClick={() => handleEditData(row)}>
                    <Icon icon='mdi:pencil-outline' />
                </IconButton>
            </AppTooltip> : null}
        </>
    )
}

export default DarkEditButton