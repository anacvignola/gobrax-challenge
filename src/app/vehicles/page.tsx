"use client";

import * as React from "react";
import Header from "@/components/header";
import { Table } from "@/components/table";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Selected } from "@/components/selected";
import { Container, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDriverStore } from "@/lib/store/driverStore";
import { Vehicle, useVehicleStore } from "@/lib/store/vehicleStore";
import { VehicleModalForm } from "@/components/vehicle-modal-form";
import { GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useEffect } from "react";
import { Animation } from "@/components/animation";

type Selected = {
  driver?: string;
  vehicle?: string;
};

export default function VehiclesPage() {
  const [openModal, setOpenModal] = React.useState(false);
  const drivers = useDriverStore((state) => state.drivers);
  const vehicles = useVehicleStore((state) => state.vehicles);
  const [vehicle, setVehicle] = React.useState<Vehicle | null>(null);
  const removeVehicle = useVehicleStore((state) => state.removeVehicle);

  const [selected, setSelected] = React.useState<Selected>({
    driver: "",
    vehicle: "",
  });

  const handleEditClick = (id: GridRowId | any) => () => {
    const data = vehicles?.filter((vehicle) => vehicle?.id === id);
    setVehicle(data[0]);
    setOpenModal(true);
  };

  const handleDeleteClick = (id: GridRowId | any) => () => {
    removeVehicle(id);
  };

  const clearVehicle = () => {
    setVehicle(null);
  };

  const onRowSelectionModelChange = (row: any) => {
    const selectVehicle = vehicles?.filter((vehicle) => vehicle?.id !== row);
    const selectDriver = drivers?.filter(
      (driver) => driver?.vehicle !== selectVehicle[0].id
    );
    setSelected({
      driver: selectDriver[0]?.name,
      vehicle: `${selectVehicle[0]?.brand} ${selectVehicle[0]?.plate}`,
    });
  };

  const columns: GridColDef<(typeof drivers)[number]>[] = [
    { field: "id", headerName: "ID", minWidth: 300 },
    {
      field: "brand",
      headerName: "Marca",
      minWidth: 200,
    },
    {
      field: "plate",
      headerName: "Placa",
      minWidth: 150,
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
            margin: "30px 0",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Selected driver={selected?.driver} vehicle={selected?.vehicle} />
          <Button
            startIcon={<AddIcon />}
            color="primary"
            variant="contained"
            onClick={() => setOpenModal(true)}
          >
            Add Veículo
          </Button>
        </Container>
        <Container>
          {vehicles.length <= 0 ? (
            <Animation />
          ) : (
            <Table
              columns={columns}
              rows={vehicles}
              onRowSelectionModelChange={onRowSelectionModelChange}
            />
          )}
        </Container>
      </Container>
      <VehicleModalForm
        data={vehicle}
        clearVehicle={clearVehicle}
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </>
  );
}
