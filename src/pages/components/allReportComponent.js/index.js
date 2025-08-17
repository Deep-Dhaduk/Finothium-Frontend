import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/page-header'
import { Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import { pageSizeLength, defaultPageSize } from 'src/varibles/variable'
import { CustomNoRowsOverlay, AppTooltip } from 'src/allFunction/commonFunction'

const AllReport = (props) => {
    const { rows, columns } = props

    const [pageSize, setPageSize] = useState(defaultPageSize);

    const theme = JSON.parse(localStorage.getItem("settings"))
    const updatedColumns = columns.map(column => {
        if (column.field === 'PaidAmount') {
            return {
                ...column,
                renderCell: (params) => {
                    return (
                        params.row.PaidAmount !== "0.00" ?
                            <Typography variant='paragraph' sx={{ color: "warning.main" }}>&#8377; {parseFloat(params.row.PaidAmount)}</Typography> :
                            ""
                    )
                }
            };
        }

        if (column.field === 'ReceiveAmount') {
            return {
                ...column,
                renderCell: (params) => {
                    return (
                        params.row.ReceiveAmount !== "0.00" ?
                            <Typography variant='paragraph' sx={{ color: "info.main" }}>&#8377; {parseFloat(params.row.ReceiveAmount)}</Typography> :
                            ""
                    );
                },
            };
        }

        if (column.field === 'description') {
            return {
                ...column,
                renderCell: (params) => (

                    <AppTooltip placement='top' title={params.row.description}>
                        <Typography variant="paragraph" sx={{ cursor: 'pointer' }}>
                            {params.row.description}
                        </Typography>
                    </AppTooltip>
                ),
            };
        }

        return column;
    });

    return (
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12} md={12}>
                <div className='menu-item-hide'>
                    <DataGrid
                        autoHeight
                        rows={rows}
                        columns={updatedColumns}
                        pageSize={pageSize}
                        disableSelectionOnClick
                        rowsPerPageOptions={pageSizeLength}
                        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        components={{
                            NoRowsOverlay: CustomNoRowsOverlay,
                        }}
                        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    />
                </div>
            </Grid>

        </Grid>
    )
}

export default AllReport