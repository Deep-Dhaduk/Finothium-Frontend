// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import AddTransfer from './AddTransfer'
import AddButton from 'src/component/addButton/AddButton'
import FilterDialogBox from 'src/component/filterDialog/FilterDialogBox'
import { addIcon } from 'src/varibles/icons'

const TableHeader = props => {
    // ** Props
    const { value, handleFilter, type, transferData, titleName, setTransferData, filename, filterData, filterDropdownData, advanceFilterConfig, activeAccount, activePaymentType, activeSubCategory } = props

    // ** State
    const [open, setOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const handleDialogToggle = () => setOpen(!open)
    const handleFilterDialogToggle = () => setFilterOpen(!filterOpen)
    const handleFilterClose = () => setFilterOpen(false)

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Box
                sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <TextField
                    size='small'
                    value={value}
                    sx={{ mr: 4, mb: 2.5 }}
                    placeholder={`Search ${titleName}`}
                    onChange={e => handleFilter(e.target.value)}
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <AddButton filename={'transferData'} data={transferData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} filterTitle="Filter" handleFilterDialogToggle={handleFilterDialogToggle} />
                </Box>
            </Box >

            {open ? <AddTransfer open={open} handleClose={handleClose} type={type} setTransferData={setTransferData} activeAccount={activeAccount} activePaymentType={activePaymentType} activeSubCategory={activeSubCategory} filterData={filterData} /> : ''}
            {filterOpen ? <FilterDialogBox open={filterOpen} handleDialogToggle={handleFilterDialogToggle} handleClose={handleFilterClose} type={type} setTransferData={setTransferData} filterDropdownData={filterDropdownData} advanceFilterConfig={advanceFilterConfig} /> : ''}
        </>
    )
}

export default TableHeader
