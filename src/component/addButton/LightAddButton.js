import { Box, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useExcelDownloder } from 'react-xls';
import Icon from 'src/@core/components/icon';
import { checkAllowAdd } from 'src/allFunction/commonFunction';
import LightExportExcel from 'src/component/exportExcel/LightExcelButton';
import { getDecodedToken } from 'src/allFunction/commonFunction';
import { filterIcon } from 'src/varibles/icons';

const LightModeTooltip = (props) => {
    const { ExcelDownloder, Type } = useExcelDownloder();
    const { data, filename, handleDialogToggle, icon, title, titleName, handleFilterDialogToggle, filterTitle } = props

    const store = useSelector(store => store.roleWisePermission)

    const addVisibility = checkAllowAdd(store.data, titleName)
    const decodedToken = getDecodedToken();


    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>{title}</Typography>}>
                <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleDialogToggle}>
                    <Icon icon={icon} />
                </Box>
            </Tooltip> : null}
            {filterTitle && <Tooltip placement='top' title={<Typography sx={{ fontSize: 13, color: "white" }}>{filterTitle}</Typography>}>
                <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleFilterDialogToggle}>
                    <Icon icon={filterIcon} />
                </Box>
            </Tooltip>}
            {data.length > 0 && <LightExportExcel data={data} filename={filename} />}

        </>
    )
}

export default LightModeTooltip