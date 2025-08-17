// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import SidebarAddUser from './AddUserDrawer'



const TableHeader = props => {
  // ** Props
  const { handleFilter, value, data, titleName, setUserData, activeRole, activeCompany } = props


  const dataWithoutPasswords = data.map(({ password, confirmpassword, ...rest }) => rest);

  const { ExcelDownloder, Type } = useExcelDownloder();

  // ** State
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const handleDialogToggle = () => setOpen(!open)

  const handleClose = () => {
    setOpen(false)
  }

  const theme = JSON.parse(localStorage.getItem('settings'))

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <TextField
        size='small'
        value={value}
        sx={{ mr: 6, mb: 2 }}
        placeholder='Search User'
        onChange={e => handleFilter(e.target.value)}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <AddButton filename={"userData"} data={dataWithoutPasswords} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} />
      </Box>
      {open ? <SidebarAddUser open={open} handleClose={handleClose} setUserData={setUserData} activeRole={activeRole} activeCompany={activeCompany} value={value} /> : ''}

    </Box>
  )
}

export default TableHeader
