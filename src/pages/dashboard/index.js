// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Box, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { checkAllowAccess, formatDate, formatDateRange, formatDateTime } from 'src/allFunction/commonFunction'
import { fetchTransferData } from 'src/api/allTransaction/transfer'
import { fetchDashboard } from 'src/api/dashboard/dashboardData'
import { fetchDashboardTransaction } from 'src/api/dashboard/transaction'
import PaymentTransactionData from 'src/component/paymentTransaction'
import ReceiptTransactionData from 'src/component/receiptTransation'
import TransferData from 'src/component/transferData'
import { payment, receipt, transferTransaction } from 'src/varibles/constant'
import { dateRangeOptions } from 'src/varibles/dateRange'
import { annuallyIcon } from 'src/varibles/icons'
import { defaultDashboardDataLimit } from 'src/varibles/variable'
import TotalBalance from 'src/views/dashboards/TotalBalance'
import TotalPaid from 'src/views/dashboards/TotalPaid'
import TotalReceive from 'src/views/dashboards/TotalReceive'
import AllReportAmount from 'src/views/report/AllReportAmount-v2'
import { DateRangeContext, FiscalContext, LoadingContext } from '../_app'

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
  const { settingDate } = useContext(DateRangeContext)
  const { fiscalDate, setFiscalDate } = useContext(FiscalContext)
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)

  const [totalReceive, setTotalRecieve] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalBalance, setTotalBalance] = useState(0)
  const [dateRangeValue, setDateRangeValue] = useState('')
  const [paymentData, setPaymentData] = useState([])
  const [receiptData, setReceiptData] = useState([])
  const [transferData, setTransferData] = useState([])

  const fetchData = async () => {
    const response = await fetchDashboard({
      startDate: settingDate.fromDate,
      endDate: settingDate.toDate,
    })
    setTotalBalance(response.data.TotalBalance)
    setTotalRecieve(response.data.TotalReceiveAmount)
    setTotalPaid(response.data.TotalPaidAmount)
  }

  const fetchReceiptData = async () => {
    const receipt = await fetchDashboardTransaction({
      startDate: settingDate.fromDate,
      endDate: settingDate.toDate,
      type: "Receipt",
      paymentTypeIds: null,
      clientTypeIds: null,
      categoryTypeIds: null,
      accountIds: null,
      groupTypeIds: null,
      accountTypeIds: null,
      limit: defaultDashboardDataLimit
    })
    setReceiptData(receipt.data)
  }

  const fetchPaymentData = async () => {
    const payment = await fetchDashboardTransaction({
      startDate: settingDate.fromDate,
      endDate: settingDate.toDate,
      type: "Payment",
      paymentTypeIds: null,
      clientTypeIds: null,
      categoryTypeIds: null,
      accountIds: null,
      groupTypeIds: null,
      accountTypeIds: null,
      limit: defaultDashboardDataLimit
    })
    setPaymentData(payment.data)
  }

  const fetchTransactionData = async () => {
    const response = await fetchTransferData({
      startDate: settingDate.fromDate,
      endDate: settingDate.toDate,
      paymentTypeIds: null,
      accountIds: null,
      limit: defaultDashboardDataLimit
    })
    setTransferData(response.data)
  }

  const getDateRange = () => {
    const monthDuration = dateRangeOptions.find(x => x.id === settingDate.dateRange)
    if (monthDuration) {

      const dateRangeString = `${monthDuration.label} (${formatDateRange(settingDate.fromDate, settingDate.toDate)})`
      setDateRangeValue(dateRangeString)
    }
  }

  useEffect(() => {
    try {
      setShowSpinner(true)
      fetchData()
      getDateRange()
      fetchReceiptData()
      fetchPaymentData()
      fetchTransactionData()
    } catch (error) {
      console.error(`Error fetching data:`, error)
    } finally {
      setTimeout(() => {
        setShowSpinner(false)
      }, 1000);
    }

  }, [settingDate])

  const store = useSelector(store => store.permissions)
  const addPaymentVisibility = checkAllowAccess(store.data, payment)
  const addRecieptVisibility = checkAllowAccess(store.data, receipt)
  const addTransferVisibility = checkAllowAccess(store.data, transferTransaction)
  const addAccountGroupVisibility = checkAllowAccess(store.data, 'Account Group Statement')
  const addCompanyDataisibility = checkAllowAccess(store.data, 'Company Statement')

  return (

    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center' }}>
          <Icon icon={annuallyIcon} fontSize={22} />
          <Box ml={2}>
            {(dateRangeValue)}
          </Box>
        </Typography>
      </Grid>
      {addCompanyDataisibility && <><Grid item xs={12} md={4}>
        <TotalReceive rows={totalReceive} title="Payment" />
      </Grid>
        <Grid item xs={12} md={4}>
          <TotalPaid rows={totalPaid} title="Payment" />
        </Grid>
        <Grid item xs={12} md={4}>
          <TotalBalance rows={totalBalance} title="Payment" />
        </Grid>
      </>}
      {addAccountGroupVisibility && <Grid item xs={12} md={12}>
        <AllReportAmount columns={defaultColumns} title="Group" />
      </Grid>}
      {addRecieptVisibility && receiptData.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <ReceiptTransactionData transactionData={receiptData} />
      </Grid>}
      {addPaymentVisibility && paymentData.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <PaymentTransactionData transactionData={paymentData} />
      </Grid>}
      {addTransferVisibility && transferData.length > 0 && <Grid item xs={12} md={12} sx={{ mb: 5 }}>
        <TransferData transferData={transferData} />
      </Grid>}
    </Grid>
  )
}

export default Dashboard
