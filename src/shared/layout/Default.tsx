import { Fragment, useState } from "react";
import DefaultHeader from "../components/header/DefaultHeader";
import { DefaultDrawer } from "../components/drawer/DefaultDrawer";
import { Outlet } from "react-router-dom";
import { Box, ThemeProvider } from "@mui/material";
import { theme } from "../styles/theme";

export function DefaultLayout() {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <DefaultHeader open={open} />
                <DefaultDrawer setOpen={setOpen} open={open} />
                <Box sx={{ marginLeft: '110px' }}>
                    <Outlet />
                </Box>
            </ThemeProvider>
        </Fragment>

    )
}