import { Box, Typography } from '@mui/material';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Icon from 'src/@core/components/icon';
import { AppTooltip } from 'src/allFunction/commonFunction';
import { excelIcon } from 'src/varibles/icons';

const DarkExportExcel = (props) => {
  const { data, filename } = props
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Add header row
    worksheet.addRow(Object.keys(data[0]));

    // Add data rows
    data.forEach((data) => {
      worksheet.addRow(Object.values(data));
    });
    const blob = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([blob]), `${filename}.xlsx`);
  };

  return (
    <div>
      <AppTooltip placement='top' title='Export to Excel'>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: "5px", p: 2, bgcolor: "#7cd143", cursor: "pointer", color: "white" }} onClick={handleExportExcel}>
            <Icon icon={excelIcon} fontSize={20} />
          </Typography>
        </Box>
      </AppTooltip>
    </div>
  )
}

export default DarkExportExcel
