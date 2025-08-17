import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useExcelDownloder } from 'react-xls';
import Icon from 'src/@core/components/icon';
import { AppTooltip, checkAllowAdd, getDecodedToken } from 'src/allFunction/commonFunction';
import DarkExportExcel from 'src/component/exportExcel/DarkExcelButton';
import { filterIcon } from 'src/varibles/icons';

const AddButton = (props) => {
    const { ExcelDownloder, Type } = useExcelDownloder();
    const { data, filename, handleDialogToggle, icon, title, titleName, handleFilterDialogToggle, filterTitle } = props
    const store = useSelector(store => store.roleWisePermission)
    const addVisibility = checkAllowAdd(store.data, titleName)
    const decodedToken = getDecodedToken();

    return (
        <>
            {decodedToken && decodedToken.tenantExpire === 0 && addVisibility ? <AppTooltip placement='top' title={title}>
                <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleDialogToggle}>
                    <Icon icon={icon} />
                </Box>
            </AppTooltip> : null}
            {filterTitle && <AppTooltip placement='top' title={filterTitle}>
                <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleFilterDialogToggle}>
                    <Icon icon={filterIcon} />
                </Box>
            </AppTooltip>}

            {data.length > 0 && <DarkExportExcel data={data} filename={filename} />}
        </>
    )
}

export default AddButton