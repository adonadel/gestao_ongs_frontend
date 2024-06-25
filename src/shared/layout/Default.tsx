import {Box, ThemeProvider, Typography} from "@mui/material";
import {Fragment, useState} from "react";
import {Outlet} from "react-router-dom";
import LoginModal from "../../modules/auth/login/LoginModal";
import {DefaultDrawer} from "../components/drawer/DefaultDrawer";
import DefaultHeader from "../components/header/DefaultHeader";
import useAuthStore from "../store/authStore";
import {theme} from "../styles/theme";

export function DefaultLayout() {
    const [open, setOpen] = useState(false);
    const isLogged = useAuthStore(state => state.isLogged);
    const userType = useAuthStore(state => state.userData?.type);

    return (
        <Fragment>
            <ThemeProvider theme={theme}>
                <DefaultHeader open={open} />
                {isLogged ? (
                    userType === "INTERNAL" ? (
                        <>
                            <DefaultDrawer setOpen={setOpen} open={open} />
                            <Box sx={{ marginLeft: '110px' }}>
                                <Outlet />
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h1">Você não tem permissão para acessar essa página</Typography>
                    )
                ) : (
                    <LoginModal />
                )}
            </ThemeProvider>
        </Fragment>

    )
}