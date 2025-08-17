import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import PageHeader from 'src/@core/components/page-header'
import { fetchFiscalDate, getDecodedToken, getReportDateRange, showErrorToast, showSuccessToast } from 'src/allFunction/commonFunction'
import { fetchCompanySetting, updateCompanySetting } from 'src/api/setting'
import { useAuth } from 'src/hooks/useAuth'
import { dateRangeOptions } from 'src/varibles/dateRange'
import { cancelIcon, saveIcon } from 'src/varibles/icons'
import { months } from 'src/varibles/month'
import { DateRangeContext, FiscalContext, LoadingContext } from '../_app'

const Setting = () => {

    const { setShowSpinner } = useContext(LoadingContext)
    const { settingDate, setSettingDate } = useContext(DateRangeContext)
    const { fiscalDate, setFiscalDate } = useContext(FiscalContext)

    const [dateRange, setDateRange] = useState(settingDate.dateRange)
    const [month, setMonth] = useState(0)
    const [settingData, setSettingData] = useState({})

    const { tenantExpire } = getDecodedToken()

    const auth = useAuth()

    const filteredOptions = dateRangeOptions.filter(item => item.value !== 'custom_date_range');

    const fetchData = async () => {
        try {
            setShowSpinner(true);
            const responseSetting = await fetchCompanySetting()
            const currentMonth = months.find(x => x.id === responseSetting.data[0].fiscal_start_month)
            const currentDateRange = dateRangeOptions.find(x => x.id === responseSetting.data[0].default_date_option)
            setSettingData(responseSetting.data[0])
            setMonth(currentMonth.id)
            setDateRange(currentDateRange.id)
        } catch (error) {
            // Handle any errors here
            console.error('Error fetching Company Setting data:', error);
        } finally {
            setShowSpinner(false);
        }
    }

    useEffect(() => {
        if (auth.user) {
            fetchData()
        }
    }, [])

    const handleMonthChange = (e) => {
        setMonth(e.target.value)
    }
    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value)
    }

    const router = useRouter()

    const handleCancel = () => {
        router.replace('/dashboard')
    }

    const getDatesAndUpdate = () => {
        const fiscalDate = getFiscalDate(month)
        const { fromDate, toDate } = getReportDateRange(dateRange, fiscalDate)
        setSettingDate({ ...settingDate, fromDate, toDate, dateRange })
    }

    const onSubmit = async () => {
        try {
            const data = { fiscal_start_month: month, default_date_option: dateRange };
            const response = await updateCompanySetting(data);

            if (response.success) {
                showSuccessToast("Settings Updated Successfully.");
                getDatesAndUpdate()
                handleCancel();
            } else {
                showErrorToast("Failed to update settings. Please try again later.");
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            showErrorToast("An unexpected error occurred. Please try again later.");
        }
    };

    const getFiscalDate = (fiscalStartMonth) => {
        const data = fetchFiscalDate(fiscalStartMonth)
        setFiscalDate({ ...fiscalDate, currentFiscal: data.currentFiscalData, lastFiscal: data.lastFiscalData })
        return data
    }


    return (
        <Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ p: 5, mt: 5, width: 500 }}>
                    <Grid container spacing={2} mb={6} >
                        <Grid item xs={12} sm={12} mb={3}>
                            <PageHeader
                                title={<Typography variant='h6' sx={{ display: 'flex', justifyContent: 'center' }}>Settings</Typography>}
                            />
                            <FormControl fullWidth sx={{ mt: 5 }}>
                                <InputLabel id="demo-simple-select-label">Fiscal Start Month</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={month}
                                    defaultValue={month}
                                    label="Start Fiscal Month"
                                    onChange={handleMonthChange}
                                >
                                    {months.map((item) => {
                                        return <MenuItem key={item.id} value={item.id} >{item.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Default Date Range</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={dateRange}
                                    defaultValue={dateRange}
                                    label="Start Fiscal Month"
                                    onChange={handleDateRangeChange}
                                >
                                    {filteredOptions.map((item) => {
                                        return <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
                        {tenantExpire === 0 && <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={onSubmit}>
                            <Typography sx={{ display: 'flex', paddingRight: "3px", color: "white" }}><Icon icon={saveIcon} /></Typography>
                            <Typography sx={{ color: "white" }}>Save</Typography>
                        </Button>}
                        <Button size='large' variant='outlined' color='secondary' sx={{ display: 'flex', alignItems: "center" }} onClick={handleCancel}>
                            <Typography sx={{ display: 'flex', paddingRight: "3px" }}> <Icon icon={cancelIcon} /> </Typography>
                            <Typography>Cancel</Typography>
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Grid>
    )
}

export default Setting