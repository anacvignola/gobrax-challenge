"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  GridRowSelectionModel,
  GridCallbackDetails,
} from "@mui/x-data-grid";

interface TableProps {
  rows: GridValidRowModel[];
  columns: GridColDef<any>[];
  onRowSelectionModelChange:
    | ((
        rowSelectionModel: GridRowSelectionModel,
        details: GridCallbackDetails<any>
      ) => void)
    | undefined;
}

export const Table = ({
  columns,
  rows,
  onRowSelectionModelChange,
}: TableProps) => {
  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        pageSizeOptions={[10]}
        disableMultipleRowSelection
        onRowSelectionModelChange={onRowSelectionModelChange}
      />
    </Box>
  );
};
