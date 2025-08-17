// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useExcelDownloder } from 'react-xls'
import AddButton from 'src/component/addButton/AddButton'
import FilterDialogBox from 'src/component/filterDialog/FilterDialogBox'
import { addIcon } from 'src/varibles/icons'
import AddPaymentTransaction from './AddPaymentTransaction'


const TableHeader = props => {
    // ** Props
    const { value, handleFilter, type, transactionData, setTransactionData, categoryData, clientData, titleName, filterData, filename, filterDropdownData, advanceFilterConfig, fetchActiveAccount, fetchActivePaymentType, activeAccount, activePaymentType, activeClient, activeSubCategory } = props
    // ** State
    const [open, setOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    const handleDialogToggle = () => setOpen(!open)
    const handleFilterDialogToggle = () => setFilterOpen(!filterOpen)

    const handleClose = () => {
        setOpen(false)
    }

    const handleFilterClose = () => setFilterOpen(false)

    const { ExcelDownloder, Type } = useExcelDownloder();

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
                    <AddButton filename={filename} data={transactionData} handleDialogToggle={handleDialogToggle} icon={addIcon} title={"Add"} titleName={titleName} filterTitle="Filter" handleFilterDialogToggle={handleFilterDialogToggle} />
                </Box>
            </Box>

            {open ? <AddPaymentTransaction open={open} handleClose={handleClose} type={type} handleDialogToggle={handleDialogToggle} filterData={filterData} transactionData={transactionData} setTransactionData={setTransactionData} fetchActiveAccount={fetchActiveAccount} fetchActivePaymentType={fetchActivePaymentType} activeAccount={activeAccount} activePaymentType={activePaymentType} activeClient={activeClient} activeSubCategory={activeSubCategory} value={value} /> : ''}
            {filterOpen ? <FilterDialogBox open={filterOpen} handleClose={handleFilterClose} type={type} handleDialogToggle={handleFilterDialogToggle} categoryData={categoryData} clientData={clientData} transactionData={transactionData} setTransactionData={setTransactionData} filterDropdownData={filterDropdownData} advanceFilterConfig={advanceFilterConfig} /> : ''}
        </>
    )
}

export default TableHeader
