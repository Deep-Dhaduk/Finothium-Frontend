import { IconButton, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Icon from 'src/@core/components/icon';
import { checkAllowAdd, getDecodedToken } from 'src/allFunction/commonFunction';
import { logoutIcon } from 'src/varibles/icons';

const LightLoginButton = (props) => {
    const { handleLoginTenant, titleName } = props

    const store = useSelector(store => store.roleWisePermission)

    const addVisibility = checkAllowAdd(store.data, titleName)
    const decodedToken = getDecodedToken();


    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>Login as Tenant</Typography>}>
                <IconButton sx={{ bgcolor: "secondary.main", borderRadius: "5px", mr: 2.5, display: "flex", justifyContent: 'center', p: 1, cursor: "pointer", ":hover": { backgroundColor: "secondary.dark" }, color: "white" }} onClick={handleLoginTenant}>
                    <Icon icon={logoutIcon} />
                </IconButton>
            </Tooltip> : null}

        </>
    )
}

export default LightLoginButton