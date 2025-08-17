// ** MUI Imports
import { Divider, Grid } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { DataGrid } from '@mui/x-data-grid'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { CustomNoRowsOverlay, cardTextColor } from 'src/allFunction/commonFunction'
import { fetchGroupData } from 'src/api/dashboard/dashboardData'
import { DateRangeContext } from 'src/pages/_app'
import { accontgroupIcon, rupeeSymbol } from 'src/varibles/icons'
import { dividerBgDark, dividerBgLight } from 'src/varibles/variable'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'name',
        minWidth: 180,
        headerName: 'Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.account_name}</Typography>
    },
    {
        flex: 0.25,
        field: 'receive',
        minWidth: 140,
        headerName: 'Total Receive',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: 'info.main' }}>&#8377; {row.ReceiveAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 140,
        field: 'paid',
        headerName: 'Total Paid',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: 'warning.main' }}>&#8377; {row.PaidAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 140,
        field: 'totalBalance',
        headerName: 'Balance',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: row.TotalBalance >= 0 ? 'success.dark' : 'error.main' }}>&#8377; {row.TotalBalance}</Typography>
    }
]

const AllReportAmount = (props) => {
    const { data } = props
    const [groupData, setGroupData] = useState([])
    const { settingDate } = useContext(DateRangeContext)
    const store = useSelector(store => store.dashboardGroupData)
    const theme = JSON.parse(localStorage.getItem('settings'))

    const fetchData = async () => {
        const response = await fetchGroupData(
            {
                startDate: settingDate.fromDate,
                endDate: settingDate.toDate,
            }
        )
        setGroupData(response.data)
    }

    useEffect(() => {
        fetchData()
    }, [settingDate])

    return (
        <Grid>
            <Divider sx={{ background: theme.mode === "dark" ? dividerBgDark : dividerBgLight, p: "1px" }} />
            <Box>
                {groupData.map((item) => {
                    const id = item.account_group_name_id
                    return <Grid sx={{ my: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Icon icon={accontgroupIcon} fontSize={22} />
                            <PageHeader title={<Typography variant='h6' sx={{ ml: 2 }} >{item.account_group_name}</Typography>}></PageHeader>
                        </Box>
                        <Grid my={2} container spacing={2} >
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardHeader title='Total Receive' className='dashboard-card-title' />
                                    <CardContent>
                                        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                                            <Icon icon={rupeeSymbol} fontSize={16} />
                                            <Typography sx={{ color: 'info.main' }} variant='body3' fontSize={16}>{item.TotalReceiveAmount}</Typography>
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
                                            <Typography sx={{ color: "warning.main" }} variant='body3' fontSize={16}>{item.TotalPaidAmount}</Typography>
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', color: cardTextColor(item.TotalBalance) }}>
                                            <Icon icon={rupeeSymbol} fontSize={16} />
                                            <Typography sx={{ color: cardTextColor(item.TotalBalance) }} variant='body3' fontSize={16}>{item.TotalBalance}</Typography>
                                        </Box>
                                        {/* </Box> */}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Accordion >
                            <AccordionSummary
                                expandIcon={<Icon icon='mdi:chevron-down' fontSize={20} />}
                                id={id}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }} >
                                    {item.account_group_name} Details
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className='footer-accordian menu-item-hide'>
                                    <DataGrid
                                        autoHeight
                                        rows={item.accounts}
                                        columns={defaultColumns}
                                        disableSelectionOnClick
                                        components={{
                                            NoRowsOverlay: CustomNoRowsOverlay,
                                        }}
                                        // rowsPerPageOptions={pageSizeLength}
                                        // onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                                        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                                    />
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Box sx={{ mt: 8 }}>
                            <Divider sx={{ background: theme.mode === "dark" ? dividerBgDark : dividerBgLight, p: "1px" }} />
                        </Box>
                    </Grid>
                })}
                {/* <Box sx={{ width: '100%', textAlign: 'center', py: '10px', borderTop: 3, borderColor: "#464964" }}>
                    <Typography
                        href='/'
                        component={Link}
                        onClick={e => e.preventDefault()}
                        sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                        View all Details
                    </Typography>
                </Box> */}
            </Box>
        </Grid >
    )
}

export default AllReportAmount
