// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TotalReceive from 'src/views/dashboards/TotalReceive'
import TotalPaid from 'src/views/dashboards/TotalPaid'
import TotalBalance from 'src/views/dashboards/TotalBalance'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Button, Divider, Typography } from '@mui/material'
import AllReportAmount from 'src/views/report/AllReportAmount'
import { fetchAccountWiseData } from 'src/store/report/accountWiseStatement'
import { fetchDashboard } from 'src/store/dashboard'
import { DataGrid } from '@mui/x-data-grid'
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable'
import { CustomNoRowsOverlay, formatDate, formatDateTime } from 'src/allFunction/commonFunction'
import { payment } from 'src/varibles/constant'
import { fetchTransactionData } from 'src/store/transaction/transaction'
import PageHeader from 'src/@core/components/page-header'
import { fetchReceiptTransactionData } from 'src/store/transaction/receiptTransaction'
import { fetchTransferData } from 'src/store/transaction/transfer'
import TransferData from 'src/component/transferData'
import ReceiptTransactionData from 'src/component/receiptTransation'
import { useRouter } from 'next/router'
import PaymentTransactionData from 'src/component/paymentTransaction'

const defaultColumns = [
  {
    flex: 0.25,
    field: 'date',
    minWidth: 150,
    headerName: 'Date',
    renderCell: ({ row }) => {
      const formattedDate = formatDate(row.transaction_date)
      return <Typography variant='body2'>{formattedDate}</Typography>
    }
  },
  {
    flex: 0.25,
    minWidth: 120,
    field: 'paymentType',
    headerName: 'Payment type',
    renderCell: ({ row }) => <Typography variant='body2'>{row.payment_type_name}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 120,
    field: 'categoryName',
    headerName: 'Category Name',
    renderCell: ({ row }) => <Typography variant='body2'>{row.client_name}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 120,
    field: 'accountName',
    headerName: 'Account Name',
    renderCell: ({ row }) => <Typography variant='body2'>{row.account_name}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 80,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }) => <Typography variant='body2'>{Number(row.amount)}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 150,
    field: 'description',
    headerName: 'Description',
    renderCell: ({ row }) => <Typography variant='body2'>{row.description}</Typography>
  },
  {
    flex: 0.25,
    minWidth: 150,
    field: 'UpdateDate',
    headerName: 'Update Date',
    renderCell: ({ row }) => {
      const utcDate = formatDateTime(row.updatedOn);
      return <Typography variant='body2'>{utcDate}</Typography>
    }
  }
]

const Dashboard = () => {
  const dispatch = useDispatch()
  const [totalReceive, setTotalRecieve] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)


  const getRowId = (row) => row.transactionId;

  const storeDashboard = useSelector(state => state.dashboard)
  const store = useSelector(state => state.transaction)
  const storeReceipt = useSelector(state => state.receiptTransaction)
  const storeTransfer = useSelector(state => state.transfer)

  useEffect(() => {

    setTotalBalance(storeDashboard.data.BalanceAmount)
    setTotalRecieve(storeDashboard.data.TotalReceiveAmount)
    setTotalPaid(storeDashboard.data.TotalPaidAmount)

  }, [storeDashboard.data])

  const router = useRouter()


  useEffect(() => {
    dispatch(fetchDashboard())
    dispatch(fetchTransferData({
      startDate: null,
      endDate: null,
      paymentTypeIds: null,
      accountTypeIds: null,
      limit: 10
    }))
    dispatch(fetchTransactionData({
      startDate: null,
      endDate: null,
      type: "Payment",
      paymentTypeIds: null,
      clientTypeIds: null,
      accountTypeIds: null,
      limit: 10
    }))
    dispatch(fetchReceiptTransactionData({
      startDate: null,
      endDate: null,
      type: "Receipt",
      paymentTypeIds: null,
      clientTypeIds: null,
      accountTypeIds: null,
      limit: 10
    }))

  }, [])

  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12} md={4}>
        <TotalReceive rows={totalReceive} title="Payment" />
      </Grid>
      <Grid item xs={12} md={4}>
        <TotalPaid rows={totalPaid} title="Payment" />
      </Grid>
      <Grid item xs={12} md={4}>
        <TotalBalance rows={totalBalance} title="Payment" />
      </Grid>
      <Grid item xs={12} md={12}>
        <AllReportAmount columns={defaultColumns} title="Group" />
      </Grid>
      {storeReceipt.data.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <ReceiptTransactionData transactionData={storeReceipt.data} />
      </Grid>}
      {store.data.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <PaymentTransactionData transactionData={store.data} />
      </Grid>}
      {storeTransfer.data.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <TransferData transferData={storeTransfer.data} />
      </Grid>}
    </Grid>
  )
}

export default Dashboard
