export const defaultColumns = [
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