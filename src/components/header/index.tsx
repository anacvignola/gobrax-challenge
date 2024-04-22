"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Image from "next/image";
import Logo from "@/assets/images/logo.png";
import { Link } from "@mui/material";
import { LinkedIn } from "@mui/icons-material";

function Header() {
  const router = usePathname();

  const isRouter = (route: string) => router === route;

  return (
    <AppBar position="static" color="default">
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Link
            href="/"
            color="inherit"
            sx={{
              fontSize: 14,
              marginRight: "20px",
              fontWeight: isRouter("/") ? 600 : 500,
            }}
            underline={isRouter("/") ? "none" : "hover"}
          >
            Motoristas
          </Link>
          <Link
            color="inherit"
            href="/vehicles"
            underline={isRouter("/vehicles") ? "none" : "hover"}
            sx={{
              fontSize: 14,
              fontWeight: isRouter("/vehicles") ? 600 : 500,
            }}
          >
            Veículos
          </Link>
        </Box>

        <Image src={Logo} width={100} alt="Gobrax" priority />

        <Button
          rel="noopener"
          target="_blank"
          variant="contained"
          startIcon={<LinkedIn />}
          href="https://www.linkedin.com/in/anacvignola/"
        >
          Linkedin
        </Button>
      </Toolbar>
    </AppBar>
  );
}
export default Header;
