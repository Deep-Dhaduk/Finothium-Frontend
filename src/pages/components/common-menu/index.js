import { Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { CustomNoRowsOverlay } from 'src/allFunction/commonFunction';
import { defaultPageSize, pageSizeLength } from 'src/varibles/variable';

const CommonMenu = (props) => {
    const [pageSize, setPageSize] = useState(defaultPageSize);


    const { rows, columns } = props;
    const getRowId = (row) => row.common_id;

    return (
        <>
           <div className="menu-item-hide">
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                getRowId={getRowId}
                disableSelectionOnClick
                rowsPerPageOptions={pageSizeLength}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                components={{
                    NoRowsOverlay: CustomNoRowsOverlay,
                  }}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
            />
            </div>
        </>
    )
}

export default CommonMenu