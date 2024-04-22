"use client";

import { z } from "zod";
import { useEffect } from "react";
import { Vehicle } from "@/lib/store/vehicleStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useDriverStore, Driver } from "@/lib/store/driverStore";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import React from "react";

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
      return replacedDoc.length === 11;
    }, "CPF deve 11 caracteres.")
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
    control,
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
          <Controller
            name="vehicle"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="vehicle">
                  {vehicles.length <= 0
                    ? "Não possui nenhum veículo cadastrado"
                    : "Veículo"}
                </InputLabel>
                <Select
                  {...field}
                  id="vehicle"
                  label={
                    vehicles.length <= 0
                      ? "Não possui nenhum veículo cadastrado"
                      : "Veículo"
                  }
                  error={!!errors.vehicle}
                  disabled={vehicles.length <= 0 ? true : false}
                >
                  {vehicles?.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.brand} - {option.plate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
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
