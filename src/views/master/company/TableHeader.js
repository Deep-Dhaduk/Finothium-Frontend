// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import SidebarAddCompany from './AddCompany'

const TableHeader = props => {
    // ** Props
    const { value, handleFilter, companyData, titleName, setCompanyData } = props
    // ** State
    const [open, setOpen] = useState(false)
    const handleDialogToggle = () => setOpen(!open)

    const handleClose = () => {
        setOpen(false)
    }

    const { ExcelDownloder, Type } = useExcelDownloder();



    const theme = JSON.parse(localStorage.getItem("settings"))


    return (
        <>
            <Box
                sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <TextField
                    size='small'
                    value={value}
                    sx={{ mr: 4, mb: 2.5 }}
                    placeholder='Search Company'
                    onChange={e => handleFilter(e.target.value)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

                    <AddButton filename={"companyData"} data={companyData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} value={value} />

                </Box>
            </Box>
            {open ?
                <SidebarAddCompany handleClose={handleClose} open={open} handleDialogToggle={handleDialogToggle} setCompanyData={setCompanyData} />
                : ''}
        </>
    )
}

export default TableHeader
