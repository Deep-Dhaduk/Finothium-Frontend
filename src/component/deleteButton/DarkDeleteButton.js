import { IconButton } from '@mui/material'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { AppTooltip, checkAllowDelete } from 'src/allFunction/commonFunction'
import { getDecodedToken } from 'src/allFunction/commonFunction';
import { deleteIcon } from 'src/varibles/icons'

const DarkDeleteButton = (props) => {
    const { handleDelete, id, titleName } = props
    const decodedToken = getDecodedToken();

    const store = useSelector(store => store.roleWisePermission)

    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(fetchMenuData())
    // }, [])

    const addVisibility = checkAllowDelete(store.data, titleName)
    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <AppTooltip placement='top' title="Delete">
                <IconButton sx={{ bgcolor: "#FF4D49", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "#FF4D49" }, color: "white" }} onClick={() => handleDelete(id)}>
                    <Icon icon={deleteIcon} />
                </IconButton>
            </AppTooltip> : null}
        </>
    )
}

export default DarkDeleteButton