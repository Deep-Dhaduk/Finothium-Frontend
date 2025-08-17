import { Box, TextField, Tooltip, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { useExcelDownloder } from 'react-xls'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { AppTooltip } from 'src/allFunction/commonFunction'
import DarkExportExcel from 'src/component/exportExcel/DarkExcelButton'
import LightExportExcel from 'src/component/exportExcel/LightExcelButton'
import FilterDialogBox from 'src/component/filterDialog/FilterDialogBox'
import { ReportViewContext } from 'src/pages/_app'
import { collapseAllIcon, expandAllIcon, filterIcon } from 'src/varibles/icons'


const TableHeader = (props) => {
    const { value, handleFilter, reportData, setReportData, title, accountReportData, categoryReportData, clientReportData, companyReportData, groupReportData, paymentReportData, accountTypeReportData, subCategoryReportData, quarterlyData, semiAnnualData, annuallyData, monthlyData, handleExpandAll, expanded, filterDropdownData, fileName, advanceFilterConfig } = props
    const { reportViewSetting } = useContext(ReportViewContext)
    const [open, setOpen] = useState(false)

    const handleDialogToggle = () => setOpen(!open)

    const { ExcelDownloder, Type } = useExcelDownloder();
    const theme = JSON.parse(localStorage.getItem('settings'))

    return (
        <>
            <Box
                sx={{ pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
                {companyReportData && <TextField
                    size='small'
                    value={value}
                    sx={{ mr: 4, mb: 2.5 }}
                    placeholder={`Search ${title}`}
                    onChange={e => handleFilter(e.target.value)}
                />}
                {!companyReportData && <PageHeader
                    title={<Typography variant='h6'>{`${title} Wise Report`}</Typography>}
                />}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <AppTooltip placement='top' title="Filter">
                        <Box sx={{ bgcolor: "#666CFF", borderRadius: "5px", mb: 2, mr: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleDialogToggle}>
                            <Icon icon={filterIcon} />
                        </Box>
                    </AppTooltip>
                    {reportData.length > 0 && <DarkExportExcel filename={fileName} data={reportData} />}
                    {(reportViewSetting.summary || reportViewSetting.detail) && reportData.length > 0 && !companyReportData ? <AppTooltip placement='top' title={expanded.length !== reportData.length ? 'Expand All' : 'Collapse All'}>
                        <Box sx={{ bgcolor: 'secondary.main', borderRadius: "5px", mb: 2, ml: 2, display: "flex", justifyContent: 'center', p: 1.5, cursor: "pointer", color: "white" }} variant='contained' onClick={handleExpandAll}>
                            <Icon icon={expanded.length !== reportData.length ? expandAllIcon : collapseAllIcon} />
                        </Box>
                    </AppTooltip> : null}

                </Box>
            </Box>
            <>
            </>
            {open ?
                <FilterDialogBox handleDialogToggle={handleDialogToggle} open={open} setOpen={setOpen} accountReportData={accountReportData} categoryReportData={categoryReportData} clientReportData={clientReportData} subCategoryReportData={subCategoryReportData} companyReportData={companyReportData} groupReportData={groupReportData} paymentReportData={paymentReportData} quarterlyData={quarterlyData} semiAnnualData={semiAnnualData} annuallyData={annuallyData} monthlyData={monthlyData} title={title} accountTypeReportData={accountTypeReportData} reportData={reportData} setReportData={setReportData} filterDropdownData={filterDropdownData} advanceFilterConfig={advanceFilterConfig} />

                : null}
        </>


    )
}

export default TableHeader