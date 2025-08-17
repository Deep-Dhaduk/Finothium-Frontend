// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import AddClient from './AddClient'

const TableHeader = props => {
    // ** Props
    const { value, handleFilter, clientData, type, titleName, setClientData, filename } = props
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
                    placeholder={`Search ${type}`}
                    onChange={e => handleFilter(e.target.value)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <AddButton filename={filename} data={clientData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} />
                </Box>
            </Box>
            {open ? <AddClient open={open} handleClose={handleClose} type={type} setClientData={setClientData} value={value} /> : ''}
        </>
    )
}

export default TableHeader
