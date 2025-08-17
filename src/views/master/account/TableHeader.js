// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import AddAccount from './AddAccount'

const TableHeader = props => {
    // ** Props
    const { value, handleFilter, accountData, titleName, setAccountData, activeAccountGroup, activeAccountType } = props


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
                    placeholder='Search Account'
                    onChange={e => handleFilter(e.target.value)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <AddButton filename={"accountData"} data={accountData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} />
                </Box>
            </Box>
            {open ? <AddAccount open={open} handleClose={handleClose} setAccountData={setAccountData} activeAccountGroup={activeAccountGroup} activeAccountType={activeAccountType} /> : ''}
        </>
    )
}

export default TableHeader
