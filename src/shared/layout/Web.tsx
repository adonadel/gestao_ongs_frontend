import { Box, ThemeProvider } from "@mui/material";
import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import { theme } from "../styles/theme";
import DefaultHeader from "../components/header/DefaultHeader";
import { DefaultFooter } from "../components/footer/DefaultFooter";

export function WebLayout() {
    const [open] = useState(false);

    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <DefaultHeader open={open} />
                <Box>
                    <Outlet />
                </Box>
                <DefaultFooter />
            </ThemeProvider>
        </Fragment>

    )
}