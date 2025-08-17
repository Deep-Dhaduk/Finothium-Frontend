// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import { useState } from 'react'
import AddButton from 'src/component/addButton/AddButton'
import LightModeTooltip from 'src/component/addButton/LightAddButton'
import { addIcon } from 'src/varibles/icons'
import AddTenant from './AddTenant'
const TableHeader = props => {
    // ** Props
    const { handleFilter, value, tenantData, titleName, setTenantData } = props




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
                    sx={{ mr: 6, mb: 2 }}
                    placeholder='Search Tenant'
                    onChange={e => handleFilter(e.target.value)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <AddButton filename={"tenantData"} data={tenantData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} />
                </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

            </Box>
            {open ? <AddTenant open={open} handleClose={handleClose} setTenantData={setTenantData} value={value} /> : ''}

        </>
    )
}

export default TableHeader
