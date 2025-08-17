import { Box, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import Icon from 'src/@core/components/icon';
import { AppTooltip, checkAllowAdd, getDecodedToken } from 'src/allFunction/commonFunction';
import { logoutIcon } from 'src/varibles/icons';

const DarkLoginButton = (props) => {
    const { handleLoginTenant, titleName, id } = props
    const store = useSelector(store => store.roleWisePermission)
    const addVisibility = checkAllowAdd(store.data, titleName)
    const decodedToken = getDecodedToken();

    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <AppTooltip placement='top' title='Login as Tenant'>
                <IconButton sx={{ bgcolor: "secondary.main", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "secondary.dark" }, color: "white" }} onClick={() => handleLoginTenant(id)}>
                    <Icon icon={logoutIcon} />
                </IconButton>
            </AppTooltip> : null}
        </>
    )
}

export default DarkLoginButton