import * as React from "react";
import { CardContent, Typography } from "@mui/material";

interface SelectedProps {
  driver?: string;
  vehicle?: string;
}

export const Selected = ({ driver, vehicle }: SelectedProps) => {
  return (
    <CardContent
      sx={{
        paddingTop: 0,
      }}
    >
      <Typography
        sx={{ fontSize: 15, fontWeight: 500 }}
        variant="subtitle1"
        gutterBottom
      >
        Selecionado:
      </Typography>
      <Typography variant="subtitle2">
        Motorista:{" "}
        <Typography variant="body2" component="span">
          {driver}
        </Typography>
      </Typography>
      <Typography variant="subtitle2">
        Veículo:{" "}
        <Typography variant="body2" component="span">
          {vehicle}
        </Typography>
      </Typography>
    </CardContent>
  );
};
