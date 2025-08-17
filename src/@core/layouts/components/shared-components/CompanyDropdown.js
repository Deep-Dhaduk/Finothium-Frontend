// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'
import NProgress from 'nprogress'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useContext, useEffect, useState } from 'react'
import { fetchCompanyData, fetchData } from 'src/store/master/company'
import { changeCompany } from 'src/store/apps/user'
import Router, { useRouter } from 'next/router'
import { LoadingContext } from 'src/pages/_app'
import { useAuth } from 'src/hooks/useAuth'
import { getDecodedToken } from 'src/allFunction/commonFunction'

const CompanyDropdown = ({ settings, saveSettings }) => {
  const store = useSelector(store => store.company)
  const [company, setCompany] = useState(0)
  const { showSpinner, setShowSpinner } = useContext(LoadingContext)
  const auth = useAuth()
  // ** Hook 
  const user = JSON.parse(localStorage.getItem("userData"))
  const dispatch = useDispatch()


  useEffect(() => {
    const token = (localStorage.getItem('accessToken'))
    const decodedToken = getDecodedToken()
    if (token) {
      setCompany(decodedToken && decodedToken.companyId !== null ? decodedToken.companyId : null);
    }
  }, [store]);

  // ** Vars
  const { layout } = settings
  const router = useRouter()
  const handleLangItemClick = async (e) => {
    NProgress.start()

    setCompany(e.target.value)
    const response = await dispatch(changeCompany(e.target.value))
    localStorage.setItem("accessToken", response.payload.token)
    router.reload();
    setShowSpinner(true)
  }

  // const handleDropdownClick = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // }

  return (
    <>
      {/* <Typography onClick={handleDropdownClick}>{company || 'Select Company'}</Typography> */}
      {/* <OptionsMenu
        text={company}
        menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
        iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) }, endIcon: "mdi:menu-down" }}
        options={filterData.map((option) => ({
          text: option.company_name,
          menuItemProps: {
            sx: { py: 2 },
            selected: company === option.company_name,
            onClick: () => {
              setCompany(option.company_name);
              setDropdownOpen(true);
              // Additional logic if needed
            },
          },
        }))
        }
      /> */}
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          fullWidth
          value={company}
          defaultValue={company}
          id='select-Company'
          onChange={handleLangItemClick}
          inputProps={{ 'aria-label': 'Without label' }}

        >
          {user && user.companies.sort((a, b) => a.companyName.localeCompare(b.companyName)).map((company) => {
            return <MenuItem value={company.companyId} key={company.companyId}>{company.companyName}</MenuItem>
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default CompanyDropdown
