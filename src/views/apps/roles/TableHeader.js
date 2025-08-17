// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import AddRole from './AddRole'

const TableHeader = props => {
  // ** Props
  const { value, handleFilter, data, titleName, setRoleData } = props

  const { ExcelDownloder, Type } = useExcelDownloder();

  // ** State
  const [open, setOpen] = useState(false)
  const handleDialogToggle = () => setOpen(!open)

  const handleClose = () => {
    setOpen(false)
  }

  const theme = JSON.parse(localStorage.getItem('settings'))

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder='Search Role'
          onChange={e => handleFilter(e.target.value)}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <AddButton filename={"roleData"} data={data} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} />
        </Box>
      </Box>
      {open ? <AddRole handleDialogToggle={handleDialogToggle} handleClose={handleClose} open={open} setRoleData={setRoleData} value={value} /> : ''}
    </>
  )
}

export default TableHeader
