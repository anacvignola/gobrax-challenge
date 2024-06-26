"use client";

import * as React from "react";
import { useEffect } from "react";
import { useVehicleStore } from "@/lib/store/vehicleStore";
import { useDriverStore, Driver } from "@/lib/store/driverStore";

import {
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
} from "@mui/x-data-grid";
import Header from "@/components/header";
import { Table } from "@/components/table";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Selected } from "@/components/selected";
import { Container, Button } from "@mui/material";
import { Animation } from "@/components/animation";
import DeleteIcon from "@mui/icons-material/Delete";
import { DriverModalForm } from "@/components/driver-modal-form";

type Selected = {
  driver?: string;
  vehicle?: string;
};

export default function Home() {
  const [openModal, setOpenModal] = React.useState(false);
  const drivers = useDriverStore((state) => state.drivers);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const [driver, setDriver] = React.useState<Driver | null>(null);
  const removeDriver = useDriverStore((state) => state.removeDriver);

  const [selected, setSelected] = React.useState<Selected>({
    driver: "",
    vehicle: "",
  });

  const handleEditClick = (id: GridRowId | any) => () => {
    const data = drivers?.filter((driver) => driver?.id === id);
    setDriver(data[0]);
    setOpenModal(true);
  };

  const handleDeleteClick = (id: GridRowId | any) => () => {
    removeDriver(id);
  };

  const clearDriver = () => {
    setDriver(null);
  };

  const onRowSelectionModelChange = (row: any) => {
    const selectDriver = drivers?.filter((driver) => driver?.id !== row);
    const selectVehicle = vehicles?.filter(
      (vehicle) => vehicle?.id !== selectDriver[0].vehicle
    );
    setSelected({
      driver: selectDriver[0]?.name,
      vehicle: `${selectVehicle[0]?.brand} ${selectVehicle[0]?.plate}`,
    });
  };

  const columns: GridColDef<(typeof drivers)[number]>[] = [
    { field: "id", headerName: "ID", minWidth: 300 },
    {
      field: "name",
      headerName: "Nome",
      minWidth: 200,
    },
    {
      field: "document",
      headerName: "Documento",
      minWidth: 150,
    },
    {
      field: "vehicle",
      headerName: "Veículo",
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <span>{!params.value ? "Não" : "Sim"}</span>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    useDriverStore.persist.rehydrate();
    useVehicleStore.persist.rehydrate();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ margin: "0 auto" }}>
        <Container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            margin: "30px 0",
          }}
        >
          <Selected driver={selected?.driver} vehicle={selected?.vehicle} />
          <Button
            startIcon={<AddIcon />}
            color="primary"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Add Motorista
          </Button>
        </Container>
        <Container>
          {drivers.length <= 0 ? (
            <Animation />
          ) : (
            <Table
              columns={columns}
              rows={drivers}
              onRowSelectionModelChange={onRowSelectionModelChange}
            />
          )}
        </Container>
      </Container>
      {openModal === true ? (
        <DriverModalForm
          data={driver}
          open={openModal}
          vehicles={vehicles}
          clearDriver={clearDriver}
          handleClose={() => setOpenModal(false)}
        />
      ) : (
        ""
      )}
    </>
  );
}
