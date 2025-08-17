import { Box, Card, CardContent, CardHeader, Tooltip, Typography } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { CustomNoRowsOverlay, AppTooltip, cardTextColor, formatDate, getAllFilterData } from 'src/allFunction/commonFunction'
import { filterSubCategoryWiseData } from 'src/api/report/subCategoryReport'
import ChartComponant from 'src/component/chart'
import MessageCard from 'src/component/messageCard'
import { DateRangeContext, LoadingContext, ReportViewContext } from 'src/pages/_app'
import { categoryIcon, rupeeSymbol } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { AppContext, advanceFilter, defaultFilterData, defaultPageSize, dividerBgDark, dividerBgLight, pageSizeLength } from 'src/varibles/variable'
import TableHeader from 'src/views/report/TableHeader'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'transactionDate',
        minWidth: 150,
        headerName: 'Date',
        renderCell: ({ row }) => {
            const utcTime = formatDate(row.transactionDate)
            return <Typography variant='paragraph'>{utcTime}</Typography>
        }
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'clientName',
        headerName: 'Client/Category',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.clientName}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'paymentTypeName',
        headerName: 'Payment Type',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.paymentTypeName}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 100,
        field: 'accountName',
        headerName: 'Account Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.accountName}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'receiveAmount',
        headerName: 'Receive',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}> {row.receiveAmount !== null && <Icon icon={rupeeSymbol} fontSize={16} />}{row.receiveAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'paidAmount',
        headerName: 'Paid',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}> {row.paidAmount !== null && <Icon icon={rupeeSymbol} fontSize={16} />}{row.paidAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 250,
        field: 'description',
        headerName: 'Description',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.description}</Typography>
    }
]

const SubCategoryReport = () => {
    const { settingDate } = useContext(DateRangeContext)
    const { setShowSpinner } = useContext(LoadingContext)
    const { reportViewSetting } = useContext(ReportViewContext)

    const [value, setValue] = useState('')
    const [allIds, setAllIds] = useState({ ...defaultFilterData, startDate: settingDate.fromDate, endDate: settingDate.toDate })
    const [expanded, setExpanded] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [titleName, setTitleName] = useState('')
    const [filterDropdownData, setFilterDropdownData] = useState({});
    const [showData, setShowData] = useState(false);
    const [pageSize, setPageSize] = useState(defaultPageSize)
    const [advanceFilterConfig, setAdvanceFilterConfig] = useState(advanceFilter)


    const handleFilter = useCallback(val => {
        setValue(val)
    }, [])

    const handleAccordionChange = (index) => {
        setExpanded((prevExpanded) =>
            prevExpanded.includes(index)
                ? prevExpanded.filter((item) => item !== index)
                : [...prevExpanded, index]
        );
    };

    const handleExpandAll = () => {
        setExpanded((prevExpanded) =>
            prevExpanded.length === reportData.length ? [] : Array.from({ length: reportData.length }, (_, index) => index)
        );
    };
    const theme = JSON.parse(localStorage.getItem('settings'))

    const location = useRouter();

    const columns = [
        ...defaultColumns
    ].map(column => {
        if (column.field === 'description') {
            return {
                ...column,
                renderCell: (params) => (
                    <AppTooltip placement='top' title={params.row.description}>
                        <Typography variant="paragraph" >
                            {params.row.description}
                        </Typography>
                    </AppTooltip>
                ),
            };
        }
        return column;
    });

    useEffect(() => {
        setExpanded(Array.from({ length: reportData.length }, (_, index) => index));
    }, [reportData.length]);

    let filterData = {
        startDate: allIds.startDate,
        endDate: allIds.endDate,
        groupTypeIds: null,
        clientTypeIds: null,
        paymentTypeIds: null,
        categoryTypeIds: null,
        accountTypeIds: null,
        subCategoryIds: null,
        accountIds: null,
        params: { q: value }
    }

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const response = await filterSubCategoryWiseData(filterData)
            setReportData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        } finally {
            setShowData(true)
            setShowSpinner(false);
        }
    }
    const fetchFilterData = async () => {
        try {
            setShowSpinner(true);
            const response = await getAllFilterData()
            setFilterDropdownData(response)
        } catch (error) {
            console.error(`Error fetching filter data:`, error);
        } finally {
            setShowData(true)

            setShowSpinner(false);
        }
    }

    const filterSearchData = async () => {
        try {
            const response = await filterSubCategoryWiseData(filterData)
            setReportData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        }
    }

    const fetchChartData = () => {
        return reportData.reduce(
            (acc, item) => {
                acc.label.push(item.subCategoryName);
                acc.ReceiveAmount.push(item.ReceiveAmount);
                acc.PaidAmount.push(item.PaidAmount);
                acc.BalanceAmount.push(item.BalanceAmount);
                return acc;
            },
            { label: [], ReceiveAmount: [], PaidAmount: [], BalanceAmount: [] }
        );
    }

    const chartData = fetchChartData();

    useEffect(() => {
        filterData = { ...filterData, startDate: settingDate.fromDate, endDate: settingDate.toDate }
        setAllIds({ ...allIds, startDate: settingDate.fromDate, errorndDate: settingDate.toDate })
        fetchData()
    }, [settingDate])

    useEffect(() => {
        const navSetting = navAllChildren.find(x => x.path === location.pathname)
        const title = navSetting.title ?? ''
        setTitleName(title)
        setAdvanceFilterConfig({ ...advanceFilter, showFromDate: true, showToDate: true, showAccountGroupName: true, showAccountName: true, showAccountTypeName: true, showPaymentTypeName: true, showClientName: true, showCategoryName: true, showFromAmount: true, showToAmount: true, showSubCategory: true })
        fetchFilterData()
    }, [])

    useEffect(() => {
        filterSearchData();
    }, [value])

    return (
        <AppContext.Provider value={{ allIds, setAllIds }} >

            <Grid>
                <TableHeader value={value} handleFilter={handleFilter} title={"Sub Category"} reportData={reportData} setReportData={setReportData} subCategoryReportData={true} handleExpandAll={handleExpandAll} expanded={expanded} filterDropdownData={filterDropdownData} fileName={"subCategoryData"} advanceFilterConfig={advanceFilterConfig} />
            </Grid>

            <ChartComponant chartData={chartData} />

            {reportData.map((item, index) => {
                const id = item.subCategoryId
                const textColor = cardTextColor(item.BalanceAmount);

                return <Grid sx={{ mb: 5 }} key={index}>
                    {reportViewSetting.summary || reportViewSetting.detail ?
                        <> <Accordion defaultExpanded={[id]} expanded={expanded.includes(index)} onChange={() => handleAccordionChange(index)}>
                            <AccordionSummary
                                expandIcon={<Icon icon='mdi:chevron-down' fontSize={20} />}
                                id={id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: '10px' }}>
                                    <Icon icon={categoryIcon} fontSize={22} />
                                </Box>
                                <PageHeader title={<Typography variant='h6' >{item.subCategoryName}</Typography>}></PageHeader>

                            </AccordionSummary>
                            <AccordionDetails>
                                {reportViewSetting.summary && <div className="card-color">
                                    <Grid mb={5} container spacing={2} >
                                        <Grid item xs={12} md={4}>
                                            <Card>
                                                <CardHeader title='Total Receive' className='dashboard-card-title' />
                                                <CardContent>
                                                    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                                                        <Icon icon={rupeeSymbol} fontSize={16} />
                                                        <Typography sx={{ color: 'info.main' }} variant='body3' fontSize={16}>{item.ReceiveAmount}</Typography>
                                                    </Box>
                                                    {/* </Box> */}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card>
                                                <CardHeader title='Total Paid' className='dashboard-card-title' />
                                                <CardContent>
                                                    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: "warning.main" }}>
                                                        <Icon icon={rupeeSymbol} fontSize={16} />
                                                        <Typography sx={{ color: "warning.main" }} variant='body3' fontSize={16}>{item.PaidAmount}</Typography>
                                                    </Box>
                                                    {/* </Box> */}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card>
                                                <CardHeader title='Balance' className='dashboard-card-title' />
                                                <CardContent>
                                                    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                                    <Box sx={{ display: 'flex', alignItems: 'center', color: textColor }}>
                                                        <Icon icon={rupeeSymbol} fontSize={16} />
                                                        <Typography sx={{ color: textColor }} variant='body3' fontSize={16}>{item.BalanceAmount}</Typography>
                                                    </Box>
                                                    {/* </Box> */}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </div>}
                                {reportViewSetting.detail && <div className='menu-item-hide'>
                                    <DataGrid
                                        autoHeight
                                        rows={item.paymentDetails}
                                        columns={columns}
                                        disableSelectionOnClick
                                        components={{
                                            NoRowsOverlay: CustomNoRowsOverlay,
                                        }}
                                        pageSize={pageSize}
                                        rowsPerPageOptions={pageSizeLength}
                                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                                        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                                    />
                                </div>}
                            </AccordionDetails>
                        </Accordion>
                            <Box sx={{ mt: 5 }}>
                                <Divider sx={{ background: theme.mode === "dark" ? dividerBgDark : dividerBgLight, p: "1px" }} />
                            </Box> </> : null}
                </Grid>
            })}
            {showData && reportData.length === 0 && <MessageCard />}
        </AppContext.Provider>
    )
}

export default SubCategoryReport