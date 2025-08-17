// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Radio from '@mui/material/Radio'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MuiDrawer from '@mui/material/Drawer'
import Grid from '@mui/material/Grid'
import { subMonths } from 'date-fns'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { settingIcon } from 'src/varibles/icons'
// **date picker import
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { dateRangeOptions } from 'src/varibles/dateRange'
import { defaultDateRange, defaultReport } from 'src/varibles/variable'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useEffect } from 'react'
import { useContext } from 'react'
import { DateRangeContext, FiscalContext, ReportViewContext } from 'src/pages/_app'
import { Checkbox, FormGroup } from '@mui/material'
import { fetchCompanySetting } from 'src/api/setting'
import { getFiscalAndFrequencyYearMonth, getReportDateRange, getStartDate, reportDateRange } from 'src/allFunction/commonFunction'
import { useAuth } from 'src/hooks/useAuth'


const Toggler = styled(Box)(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  zIndex: theme.zIndex.modal,
  padding: theme.spacing(2.5),
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: 400,
  zIndex: theme.zIndex.modal,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: 400,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const CustomizerSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const Customizer = () => {
  const { fiscalDate, setFiscalDate } = useContext(FiscalContext)
  const { settingDate, setSettingDate } = useContext(DateRangeContext)
  const { reportViewSetting, setReportViewSetting } = useContext(ReportViewContext)

  // ** State
  const [open, setOpen] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reportView, setReportView] = useState(defaultReport)
  // ** Hook
  const { settings, saveSettings } = useSettings()

  // ** Vars
  const { direction } = settings

  const auth = useAuth()

  const handleChangeValue = (selectedValue) => {
    // let fromDate = new Date();
    // let toDate = new Date();
    // switch (selectedValue) {
    //   case 10:
    //     fromDate.setMonth(fromDate.getMonth() - 1);
    //     break;
    //   case 20:
    //     fromDate.setMonth(fromDate.getMonth() - 2);
    //     break;
    //   case 30:
    //     fromDate.setMonth(fromDate.getMonth() - 3);
    //     break;
    //   case 40:
    //     fromDate.setMonth(fromDate.getMonth() - 6);
    //     break;
    //   case 50:
    //     fromDate.setFullYear(fromDate.getFullYear() - 1);
    //     break;
    //   case 60:
    //     fromDate = fiscalDate.currentFiscal.fiscalStartDate
    //     toDate = fiscalDate.currentFiscal.fiscalEndDate
    //     break;
    //   case 70:
    //     fromDate = fiscalDate.lastFiscal.fiscalStartDate
    //     toDate = fiscalDate.lastFiscal.fiscalEndDate
    //     break;
    //   case 80:
    //     fromDate = fiscalDate.lastFiscal.fiscalStartDate
    //     toDate = fiscalDate.currentFiscal.fiscalEndDate
    //     break;
    //   // Add cases for other options as needed
    //   default:
    //     fromDate.setMonth(fromDate.getMonth() - 1);
    //     break;
    // }

    const { fromDate, toDate } = getReportDateRange(selectedValue, fiscalDate)

    if (selectedValue === 999) {
      setShowDatePicker(true);
      setSettingDate({ ...settingDate, dateRange: selectedValue });
    } else {
      setShowDatePicker(false);
      setSettingDate({ fromDate, toDate, dateRange: selectedValue });
    }
  }

  const handleChange = (e) => {
    const selectedValue = Number(e.target.value);
    handleChangeValue(selectedValue)
  }

  const DateRangeSet = (selectedValue) => {
    handleChangeValue(selectedValue)
  }

  const handleReportViewChange = (event) => {
    const { name, checked } = event.target;
    const numSelectedOptions = Object.values(reportViewSetting).filter((value) => value).length;

    if (name === 'chart' || name === 'summary' || name === 'detail') {
      if (checked || numSelectedOptions > 1) {
        setReportViewSetting((prevState) => ({
          ...prevState,
          [name]: checked
        }));
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('reportView', JSON.stringify(reportViewSetting));
  }, [reportViewSetting]);


  const handleStartDateChange = (date) => {
    setSettingDate(prevState => ({
      ...prevState,
      fromDate: date
    }));
  };

  const handleEndDateChange = (date) => {
    setSettingDate(prevState => ({
      ...prevState,
      toDate: date
    }));
  };

  function getScrollbarColor() {
    const storedDataString = localStorage.getItem('settings');
    const storedData = storedDataString ? JSON.parse(storedDataString) : {};
    const themeColor = storedData.themeColor;
    switch (themeColor) {
      case 'primary':
        return '#666CFF';
      case 'secondary':
        return '#6D788D';
      case 'success':
        return '#72E128';
      case 'error':
        return '#FF4D49';
      case 'warning':
        return '#FDB528';
      case 'info':
        return '#26C6F9';
      default:
        return '#666CFF'; // Default color
    }
  }

  const fetchData = async () => {
    try {
      const responseSetting = await fetchCompanySetting()
      const currentDateRange = dateRangeOptions.find(x => x.id === responseSetting.data[0].default_date_option)
      setSettingDate({ ...settingDate, dateRange: currentDateRange.id })
      DateRangeSet(currentDateRange.id)
    } catch (error) {
      // Handle any errors here
      console.error('Error fetching Company Setting data:', error);
    }
  }

  // useEffect(() => {
  //   const currentThemeColor = localStorage.getItem('settings');
  //   const scrollbarColor = getScrollbarColor(currentThemeColor);
  //   document.documentElement.style.setProperty('--scrollbar-color', scrollbarColor);
  // }, [])

  useEffect(() => {

    if (auth.user) {
      fetchData()
    }
  }, [])

  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  return (
    <div className='customizer'>
      <Toggler className='customizer-toggler' onClick={() => setOpen(true)}>
        <Icon icon={settingIcon} fontSize={20} />
      </Toggler>
      <Drawer open={open} hideBackdrop anchor='right' variant='persistent'>
        <Box
          className='customizer-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            Settings
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Customize & Preview in Real Time</Typography>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'text.secondary',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled' }}
            >
              General Settings
            </Typography>

            <Box sx={{ mb: 0 }}>
              <Typography>Date Range</Typography>
              <RadioGroup
                row
                value={settingDate.dateRange}
                onChange={handleChange}
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '.875rem', color: 'text.secondary' } }}
              >
                <Grid container>

                  {dateRangeOptions.map((option) => (
                    <Grid key={option.id} item xs={12}>
                      <FormControlLabel id={option.id} value={option.id} label={option.label} control={<Radio />} />
                    </Grid>
                  ))}
                  {showDatePicker && (
                    <DatePickerWrapper >
                      <Grid item xs={10} sx={{ marginTop: 2 }} >
                        <DatePicker
                          selected={settingDate.fromDate}
                          id='basic-input'
                          dateFormat='dd-MMMM-yyyy'
                          maxDate={settingDate.toDate}
                          popperPlacement={popperPlacement}
                          onChange={handleStartDateChange}
                          placeholderText='Click to select a date'
                          customInput={<CustomInput label='From Date' />}
                        />
                      </Grid>
                      <Grid item xs={10} sx={{ marginTop: 4 }}>
                        <DatePicker
                          selected={settingDate.toDate}
                          id='basic-input'
                          dateFormat='dd-MMMM-yyyy'
                          minDate={settingDate.fromDate}
                          popperPlacement={popperPlacement}
                          onChange={handleEndDateChange}
                          placeholderText='Click to select a date'
                          customInput={<CustomInput label='To Date' />}
                        />
                      </Grid>
                    </DatePickerWrapper>
                  )}
                </Grid>
              </RadioGroup>
            </Box>

          </CustomizerSpacing>

          <Divider sx={{ m: '0 !important' }} />

          <CustomizerSpacing className='customizer-body'>
            <Typography
              component='p'
              variant='caption'
              sx={{ mb: 4, color: 'text.disabled' }}
            >
              Report Settings
            </Typography>

            <Box sx={{ mb: 0 }}>
              <Typography>Report View</Typography>
              <FormGroup>
                <FormControlLabel required
                  control={<Checkbox name='chart'
                    checked={reportViewSetting.chart}
                    onChange={handleReportViewChange} />}
                  label="Chart" />
                <FormControlLabel required
                  control={<Checkbox name='summary'
                    checked={reportViewSetting.summary}
                    onChange={handleReportViewChange} />}
                  label="Summary" />
                <FormControlLabel required
                  control={<Checkbox name='detail'
                    checked={reportViewSetting.detail}

                    onChange={handleReportViewChange} />}
                  label="Details" />

              </FormGroup>
            </Box>
          </CustomizerSpacing>

          {/* <Divider sx={{ m: '0 !important' }} /> */}

        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default Customizer

