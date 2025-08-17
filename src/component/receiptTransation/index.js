import { Button, Typography, Link, Tooltip, Box, Card } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { CustomNoRowsOverlay, formatDate, formatDateTime, AppTooltip } from 'src/allFunction/commonFunction'
import { fetchTransferData } from 'src/store/transaction/transfer'
import Icon from 'src/@core/components/icon'
import { rupeeSymbol, receiptIcon } from 'src/varibles/icons'

const defaultColumns = [
    {
        flex: 0.25,
        field: 'date',
        minWidth: 150,
        headerName: 'Date',
        renderCell: ({ row }) => {
            const formattedDate = formatDate(row.transaction_date)
            return <Typography variant='paragraph'>{formattedDate}</Typography>
        }
    },
    {
        flex: 0.25,
        minWidth: 120,
        field: 'payment_type_name',
        headerName: 'Payment Type',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.payment_type_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 120,
        field: 'client_name',
        headerName: 'Client Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.client_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 120,
        field: 'accountName',
        headerName: 'Account Name',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.account_name}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 80,
        field: 'amount',
        headerName: 'Amount',
        renderCell: ({ row }) => <Typography variant='paragraph' sx={{ color: 'info.main', display: 'flex', alignItems: 'center' }}><Icon icon={rupeeSymbol} fontSize={16} />{Number(row.amount)}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 150,
        field: 'description',
        headerName: 'Description',
        renderCell: ({ row }) => <Typography variant='paragraph'>{row.description}</Typography>
    },
    {
        flex: 0.25,
        minWidth: 150,
        field: 'UpdateDate',
        headerName: 'Updated',
        // sortable: false,
        renderCell: ({ row }) => {
            const utcDate = formatDateTime(row.updatedOn);
            return <Typography variant='paragraph'>{utcDate}</Typography>
        }
    }
]

const ReceiptTransactionData = (props) => {
    const { transactionData } = props

    const getRowId = (row) => row.transactionId;
    const theme = JSON.parse(localStorage.getItem('settings'))

    const router = useRouter()

    const columns = [
        ...defaultColumns
    ].map(column => {
        if (column.field === 'description') {
            return {
                ...column,
                renderCell: (params) => (
                    theme.mode === "dark" ? (
                        <AppTooltip placement='top' title={params.row.description}>
                            <Typography variant="paragraph" >
                                {params.row.description}

                            </Typography>
                        </AppTooltip>
                    ) : (

                        <Tooltip placement='top' title={<Typography variant="paragraph" sx={{ fontSize: 13, color: "white", fontWeight: 'normal' }}>{params.row.description}</Typography>}>
                            <Typography variant="paragraph" >{params.row.description}</Typography>
                        </Tooltip>


                    )
                ),
            };
        }
        return column;
    });

    const navigate = () => {
        router.push('/transaction/receipt-transaction/')
        return () => { }
    }

    return (
        <Card>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3, ml: 3 }}>
                <Icon icon={receiptIcon} fontSize={22} />
                <PageHeader title={<Typography sx={{ ml: 3 }} variant='h6'>Recent Receipt Transactions</Typography>}></PageHeader>
            </Box>
            <Box sx={{ mx: 3 }}>

                <div className='footer-accordian menu-item-hide'>
                    <DataGrid
                        autoHeight
                        rows={transactionData}
                        columns={columns}
                        disableSelectionOnClick
                        getRowId={getRowId}
                        // onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                        components={{
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                    />
                </div>
            </Box>
            <>
                <Typography
                    variant='paragraph'
                    sx={{
                        backgroundColor: theme.mode === "dark" ? "#3A3E5B" : "#F5F5F7",
                        display: 'flex',
                        p: 2,
                        minHeight: '30px',
                        justifyContent: 'center',
                        fontSize: 14,
                    }}

                >
                    {transactionData.length >= 10 && <Link onClick={navigate} sx={{
                        color: '#666CFF', cursor: 'pointer',
                        ':hover': {
                            color: theme.mode === "dark" ? "#C2C2C5" : "#85858C",
                            textDecoration: 'none'
                        }, textTransform: 'none'
                    }}> View more Receipt Transactions</Link>}

                </Typography>
            </>

        </Card>
    )
}

export default ReceiptTransactionData