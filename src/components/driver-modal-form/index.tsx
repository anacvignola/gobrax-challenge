"use client";

import { z } from "zod";
import { useEffect } from "react";
import { Vehicle } from "@/lib/store/vehicleStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useDriverStore, Driver } from "@/lib/store/driverStore";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

interface DriverModalFormProps {
  open: boolean;
  data?: Driver | null;
  vehicles: Vehicle[];
  clearDriver: () => void;
  handleClose: () => void;
}

const schema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }).min(3),
  document: z
    .string({ required_error: "CPF é obrigatório" })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return replacedDoc.length >= 11;
    }, "CPF deve conter no mínimo 11 caracteres.")
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, "");
      return !!Number(replacedDoc);
    }, "CPF deve conter apenas números."),
  vehicle: z.string().optional(),
});

export const DriverModalForm = ({
  open,
  data,
  vehicles,
  clearDriver,
  handleClose,
}: DriverModalFormProps) => {
  const addDriver = useDriverStore((state) => state.addDriver);
  const updateDriver = useDriverStore((state) => state.updateDriver);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (dataForm: FieldValues) => {
    const { name, document, vehicle } = dataForm;
    if (open === true && data) {
      const id = data?.id;
      updateDriver(id, name, document, vehicle);
    } else {
      addDriver(name, document, vehicle);
    }
    clearDriver();
    handleClose();
    reset();
  };

  useEffect(() => {
    if (open === true && data !== null) {
      setValue("name", data?.name);
      setValue("document", data?.document);
      setValue("vehicle", data?.vehicle);
    }
  }, [open, data, setValue]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm">
      <DialogTitle>Cadastro de motorista</DialogTitle>
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
            id="name"
            label="Nome"
            variant="outlined"
            {...register("name")}
            error={!!errors.name}
          />
          <TextField
            id="document"
            label="CPF"
            variant="outlined"
            {...register("document")}
            error={!!errors.document}
          />
          <Select
            id="vehicle"
            label="Veículo"
            placeholder="Veículo"
            {...register("vehicle")}
            disabled={vehicles.length <= 0 ? true : false}
            error={!!errors.vehicle}
          >
            {vehicles.length <= 0 ? (
              <MenuItem disabled>Não possui nenhum veículo cadastrado</MenuItem>
            ) : (
              vehicles?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.brand} - {option.plate}
                </MenuItem>
              ))
            )}
          </Select>
          <Button type="submit" variant="contained" size="large">
            {!data ? "Adicionar" : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
