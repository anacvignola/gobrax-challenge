"use cleint";
import * as React from "react";
import Lottie from "react-lottie";
import { Box } from "@mui/material";
import Data from "@/assets/images/animation-data.json";

export const Animation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Data,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Lottie options={defaultOptions} width={600} height={600} />
    </Box>
  );
};
