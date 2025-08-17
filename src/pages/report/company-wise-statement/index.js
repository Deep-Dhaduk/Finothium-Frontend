import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { formatDate, getAllFilterData } from 'src/allFunction/commonFunction'
import { filterCompanyWiseData } from 'src/api/report/companyReport'
import { DateRangeContext, LoadingContext } from 'src/pages/_app'
import AllReport from 'src/pages/components/allReportComponent.js'
import { rupeeSymbol } from 'src/varibles/icons'
import { navAllChildren } from 'src/varibles/navigation'
import { AppContext, advanceFilter, defaultFilterData } from 'src/varibles/variable'
import TableHeader from 'src/views/report/TableHeader'
import { AppTooltip } from 'src/allFunction/commonFunction'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'transaction_date',
        minWidth: 150,
        headerName: 'Date',
        renderCell: ({ row }) => {
            const utcTime = formatDate(row.transaction_date)
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
        field: 'payment_type_name',
        headerName: 'Payment Type',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.payment_type_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 100,
        field: 'account_name',
        headerName: 'Account Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.account_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'ReceiveAmount',
        headerName: 'Receive',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.ReceiveAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'PaidAmount',
        headerName: 'Paid',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.PaidAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 250,
        field: 'description',
        headerName: 'Description',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.description}</Typography>
    }
]

const AccountReport = () => {
    const { settingDate, setSettingDate } = useContext(DateRangeContext)
    const { setShowSpinner } = useContext(LoadingContext)

    const [value, setValue] = useState('')
    const [titleName, setTitleName] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalPaidAmount, setTotalPaidAmount] = useState(0);
    const [totalReceiveAmount, setTotalReceiveAmount] = useState(0);
    const [reportData, setReportData] = useState([])
    const [filterDropdownData, setFilterDropdownData] = useState({});
    const [advanceFilterConfig, setAdvanceFilterConfig] = useState(advanceFilter)
    const [allIds, setAllIds] = useState({ ...defaultFilterData, startDate: settingDate.fromDate, endDate: settingDate.toDate })

    const location = useRouter();
    const textColor = totalAmount < 0 ? 'error.main' : 'success.dark';

    const handleFilter = useCallback(val => {
        setValue(val)
    }, [])

    let filterData = {
        startDate: allIds.startDate,
        endDate: allIds.endDate,
        groupTypeIds: null,
        clientTypeIds: null,
        paymentTypeIds: null,
        categoryTypeIds: null,
        accountTypeIds: null,
        accountIds: null,
        params: { q: value }
    }

    const fetchChartData = () => {
        return reportData.reduce(
            (acc, item) => {
                acc.label.push(item.fiscalName);
                acc.ReceiveAmount.push(item.ReceiveAmount);
                acc.PaidAmount.push(item.PaidAmount);
                acc.BalanceAmount.push(item.BalanceAmount);
                return acc;
            },
            { label: [], ReceiveAmount: [], PaidAmount: [], BalanceAmount: [] }
        );
    }
    const chartData = fetchChartData();

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const response = await filterCompanyWiseData(filterData)
            setReportData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        } finally {
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

            setShowSpinner(false);
        }
    }

    const filterSearchData = async () => {
        try {
            const response = await filterCompanyWiseData(filterData)
            setReportData(response.data)
        } catch (error) {
            console.error(`Error fetching ${titleName} data:`, error);
        }
    }

    useEffect(() => {
        if (Array.isArray(reportData)) {
            const calculatedTotalReceiveAmount = reportData.reduce((accumulator, currentObject) => {
                if (currentObject.ReceiveAmount) {
                    return accumulator + parseFloat(currentObject.ReceiveAmount);
                }
                return accumulator;
            }, 0);
            const calculatedTotalPaidAmount = reportData.reduce((accumulator, currentObject) => {
                if (currentObject.PaidAmount) {
                    return accumulator + parseFloat(currentObject.PaidAmount);
                }
                return accumulator;
            }, 0);
            setTotalReceiveAmount(calculatedTotalReceiveAmount ? calculatedTotalReceiveAmount : 0);
            setTotalPaidAmount(calculatedTotalPaidAmount ? calculatedTotalPaidAmount : 0);
        }
    }, [reportData]);

    useEffect(() => {
        const amt = totalReceiveAmount - totalPaidAmount;
        const roundedAmt = amt.toFixed(2);
        setTotalAmount(parseFloat(roundedAmt));
    }, [totalPaidAmount, totalReceiveAmount]);

    useEffect(() => {
        filterData = { ...filterData, startDate: settingDate.fromDate, endDate: settingDate.toDate }
        setAllIds({ ...allIds, startDate: settingDate.fromDate, errorndDate: settingDate.toDate })
        fetchData()
    }, [settingDate])

    useEffect(() => {
        const navSetting = navAllChildren.find(x => x.path === location.pathname)
        const title = navSetting.title ?? ''
        setTitleName(title)
        setAdvanceFilterConfig({ ...advanceFilter, showFromDate: true, showToDate: true, showAccountGroupName: true, showAccountName: true, showAccountTypeName: true, showPaymentTypeName: true, showClientName: true, showCategoryName: true, showFromAmount: true, showToAmount: true })
        fetchFilterData()
    }, [])

    useEffect(() => {
        filterSearchData()
    }, [value])


    return (
        <AppContext.Provider value={{ allIds, setAllIds }} >
            <Grid container spacing={6}>
                <Grid item xs={12} className='module-heading'>
                    <PageHeader
                        title={<Typography variant='h6'>Company Wise Report</Typography>}
                    />
                </Grid>
                <Grid container spacing={3} mt={4} pl={5} className='match-height'>
                    <Grid item xs={12} md={4} >
                        <Card cursor="pointer">
                            <CardHeader title='Total Receive' className='dashboard-card-title' />
                            <CardContent>
                                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'info.main' } }}>
                                    <Icon icon={rupeeSymbol} fontSize={16} />
                                    <Typography variant='paragraph' fontSize={16} sx={{ color: "info.main" }}>{totalReceiveAmount}</Typography>
                                </Box>
                                {/* </Box> */}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Card>
                            <CardHeader title='Total Paid' className='dashboard-card-title' />
                            <CardContent>
                                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'warning.main' } }}>
                                    <Icon icon={rupeeSymbol} fontSize={16} />
                                    <Typography variant='paragraph' fontSize={16} sx={{ color: "warning.main" }}>{totalPaidAmount}</Typography>
                                </Box>
                                {/* </Box> */}
                            </CardContent>
                        </Card >
                    </Grid>
                    <Grid item xs={12} md={4} >
                        <Card>
                            <CardHeader title='Balance' className='dashboard-card-title' />
                            <CardContent>
                                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.25, color: textColor } }}>
                                    <Icon icon={rupeeSymbol} fontSize={16} />
                                    <Typography variant='paragraph' fontSize={16} sx={{ color: textColor }}>{totalAmount}</Typography>
                                </Box>
                                {/* </Box> */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Card sx={{ p: 4 }}>
                        <TableHeader value={value} handleFilter={handleFilter} title={"Company"} reportData={reportData} setReportData={setReportData} companyReportData={true} filterDropdownData={filterDropdownData} advanceFilterConfig={advanceFilterConfig} fileName={"CompanyData"} />
                        <AllReport rows={reportData} columns={defaultColumns} />
                    </Card>
                </Grid>
            </Grid>
        </AppContext.Provider>
    )
}

export default AccountReport