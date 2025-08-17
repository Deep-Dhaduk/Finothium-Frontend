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
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CustomNoRowsOverlay } from 'src/allFunction/commonFunction'
import { fetchGroupData } from 'src/store/dashboardGroupData'
import { rupeeSymbol } from 'src/varibles/icons'
import { dividerBgDark, dividerBgLight } from 'src/varibles/variable'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'name',
        minWidth: 80,
        headerName: 'Name',
        renderCell: ({ row }) => <Typography variant='body2'>{row.account_name}</Typography>
    },
    {
        flex: 0.25,
        field: 'receive',
        minWidth: 80,
        headerName: 'Total Receive',
        renderCell: ({ row }) => <Typography variant='body2' style={{ color: '#72E128' }}>&#8377; {row.ReceiveAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'paid',
        headerName: 'Total Paid',
        renderCell: ({ row }) => <Typography variant='body2' style={{ color: '#FF4D49' }}>&#8377; {row.PaidAmount}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'totalBalance',
        headerName: 'Balance',
        renderCell: ({ row }) => <Typography variant='body2' style={{ color: '#26C6F9' }}>&#8377; {row.TotalBalance}</Typography>
    }
]

//     if (column.field === 'receive' || column.field === 'paid' || column.field === 'totalBalance') {
//         return {
//             ...column,
//             renderCell: (params) => {
//                 let arrowIcon, color;

//                 if (column.field === 'receive') {// Up arrow icon
//                     color = ; // Success color
//                 } else if (column.field === 'paid') {// Down arrow icon
//                     color = ; // Red color
//                 } else {
//                     color = 
//                 }

//                 return (
//                     <span style={{ color }}>
//                          {params.row}
//                         {arrowIcon && <span style={{ marginLeft: '4px' }}>{arrowIcon}</span>}
//                     </span>
//                 );
//             },
//         };
//     }

//     return column;
// });


const AllReportAmount = (props) => {

    const [expanded, setExpanded] = useState(false);

    const store = useSelector(store => store.dashboardGroupData)
    const theme = JSON.parse(localStorage.getItem('settings'))

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchGroupData())
    }, [dispatch])



    return (
        <Box>
            <Divider sx={{ background : theme.mode === "dark" ? dividerBgDark : dividerBgLight, p: "1px" }} />

            <Box  sx={{mt:5}}>
                {store.data.map((item) => {
                    const id = item.account_group_name_id
                    return <Accordion expanded={expanded === id} onChange={handleChange(id)}>
                        <AccordionSummary
                            expandIcon={<Icon icon='mdi:chevron-down' fontSize={20} />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                {item.account_group_name}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid mb={4} container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardHeader title='Total Receive' className='dashboard-card-tit' />
                                        <CardContent>
                                            {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                            <Box sx={{ mx: 3, display: 'flex', alignItems: 'center', color: '#72E128' }}>
                                                <Icon icon={rupeeSymbol} fontSize={20} />
                                                <Typography sx={{ color: '#72E128' }} variant='body3' fontSize={16}>{item.TotalReceiveAmount}</Typography>
                                            </Box>
                                            {/* </Box> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardHeader title='Total Paid' />
                                        <CardContent>
                                            {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                            <Box sx={{ mx: 3, display: 'flex', alignItems: 'center', color: '#FF4D49' }}>
                                                <Icon icon={rupeeSymbol} fontSize={20} />
                                                <Typography sx={{ color: '#FF4D49' }} variant='body3' fontSize={16}>{item.TotalPaidAmount}</Typography>
                                            </Box>
                                            {/* </Box> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardHeader title='Balance' />
                                        <CardContent>
                                            {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}> */}
                                            <Box sx={{ mx: 3, display: 'flex', alignItems: 'center', color: '#26C6F9' }}>
                                                <Icon icon={rupeeSymbol} fontSize={20} />
                                                <Typography sx={{ color: '#26C6F9' }} variant='body3' fontSize={16}>{item.TotalBalance}</Typography>
                                            </Box>
                                            {/* </Box> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <div className='footer-accordian'>
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
        </Box >
    )
}

export default AllReportAmount
