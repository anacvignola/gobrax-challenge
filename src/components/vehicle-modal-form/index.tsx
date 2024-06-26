"use client";

import { z } from "zod";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { Vehicle, useVehicleStore } from "@/lib/store/vehicleStore";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

interface VehicleModalFormProps {
  open: boolean;
  data?: Vehicle | null;
  handleClose: () => void;
  clearVehicle: () => void;
}

const schema = z.object({
  brand: z.string({ required_error: "Marca é obrigatório" }).min(3),
  plate: z
    .string({ required_error: "Placa é obrigatório" })
    .regex(/^[A-Z]{3}-\d{4}$/i, {
      message: "Placa de carro inválida",
    }),
});

export const VehicleModalForm = ({
  open,
  data,
  handleClose,
  clearVehicle,
}: VehicleModalFormProps) => {
  const addVehicle = useVehicleStore((state) => state.addVehicle);
  const updateVehicle = useVehicleStore((state) => state.updateVehicle);
  const {
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (dataForm: FieldValues) => {
    const { brand, plate } = dataForm;
    if (open === true && data) {
      const id = data?.id;
      updateVehicle(id, brand, plate);
    } else {
      addVehicle(brand, plate);
    }
    clearVehicle();
    handleClose();
    reset();
  };

  useEffect(() => {
    if (open === true && data !== null) {
      setValue("name", data?.brand);
      setValue("document", data?.plate);
    }
  }, [open, data, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Cadastro de veículo</DialogTitle>
      <DialogContent
        sx={{
          height: "100%",
          minWidth: "300px",
          maxWidth: "600px",
          minHeight: "300px",
          maxHeight: "400px",
          width: "calc(100% - 54px)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="brand"
            label="Marca"
            variant="outlined"
            {...register("brand")}
            error={!!errors.brand}
          />
          <TextField
            id="plate"
            label="Placa"
            variant="outlined"
            {...register("plate")}
            error={!!errors.plate}
          />
          <Button type="submit" variant="contained" size="large">
            {!data ? "Adicionar" : "Salvar"}
          </Button>
          <Button variant="outlined" size="large" onClick={handleClose}>
            Voltar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
