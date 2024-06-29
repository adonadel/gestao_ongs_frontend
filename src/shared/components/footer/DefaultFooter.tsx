import {AppBar, Avatar, Box, Button, Container, Divider, Grid, Toolbar, Typography} from "@mui/material"
import {Link} from "react-router-dom"
import useAuthStore from "../../store/authStore";
import {
  AccountCircle,
  CalendarMonth,
  Favorite,
  Home,
  Key,
  Login,
  PersonAdd,
  Search,
  VolunteerActivism
} from "@mui/icons-material";


export const DefaultFooter = () => {
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

    const styleButton = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: { xs: 'flex-start', lg: 'center' },
        borderRadius: '1rem',
        padding: '0.5rem 1rem',
        width: { xs: '100%', lg: 'fit-content' },
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'primary.light',
        },
    }

    return (
        <footer style={{
            width: '100%',
            position: 'relative',
            marginTop: '4rem',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: 'primary.main',
            
            boxShadow: '0 -10px 10px 0 #00000015',
        }}>

            <Container maxWidth="lg">
                <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    alignContent="stretch"
                    wrap="wrap"

                >
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',

                                zIndex: 1,
                            }}
                        >
                            <Typography
                                variant="h1"
                                component="h1"
                                sx={{
                                    color: 'primary.main',
                                    display: 'flex',
                                    gap: '1rem',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '1rem',
                                    padding: { xs: '1rem 1.5rem', md: '1rem' },
                                    backgroundColor: { xs: 'primary.main', md: 'transparent' },
                                }}
                            >
                                <Avatar
                                    src="/logoPatinhas.svg"
                                    sx={{
                                        width: { xs: '3rem', md: '4rem' },
                                        height: { xs: '3rem', md: '4rem' },
                                    }}
                                />
                                <Typography variant="h2" component="h3">
                                    <Typography
                                        variant="h5"
                                        component="h3"
                                        sx={{
                                            fontWeight: 800,
                                            color: 'secondary.main',
                                            fontSize: { xs: '1rem', md: '1.2rem' },
                                        }}
                                    >
                                        Patinhas Carentes
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            color: 'secondary.light',
                                        }}
                                    >
                                        Braço do Norte - SC
                                    </Typography>
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Divider sx={{
                            backgroundColor: 'grey.200',
                            margin: '1.5rem 0',
                            width: '80%'
                        }} />
                    </Grid>

                    <Grid item xs={12} sx={{
                        marginTop: { xs: '1.5rem', md: '1.5rem', lg: '0rem' },
                    }}>
                        <AppBar
                            position="static"
                            sx={{
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                            }}
                        >
                            <Toolbar
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    justifyItems: 'flex-start',
                                    gap: '2rem',
                                    alignItems: 'center',
                                }}
                            >
                                <Button size="small" startIcon={<Home color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/">
                                    Início
                                </Button>
                                <Button size="small" startIcon={<VolunteerActivism color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/donate">
                                    Doar
                                </Button>
                                <Button size="small" startIcon={<Favorite color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/#adoption">
                                    Adotar
                                </Button>
                                <Button size="small" startIcon={<Search color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/transparency">
                                    Transparência
                                </Button>
                                <Button size="small" startIcon={<CalendarMonth color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/#events">
                                    Eventos
                                </Button>
                                {userData?.role.name === 'admin' && (
                                    <Button size="small" startIcon={<Key color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/admin/dashboard">
                                        Acesso administrativo
                                    </Button>
                                )}
                                {!userData && (
                                    <>
                                        <Button size="small" startIcon={<Login color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/login">
                                            Entrar
                                        </Button>
                                        <Button size="small" startIcon={<PersonAdd color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to="/register">
                                            Criar conta
                                        </Button>
                                    </>
                                )}
                                {userData && (
                                    <Button size="small" startIcon={<AccountCircle color="secondary" />} color="inherit" variant="text" component={Link} sx={styleButton} to={userData.type === 'EXTERNAL' ? '/external' : '/admin/user'}>
                                        Meu perfil
                                    </Button>
                                )}
                            </Toolbar>
                        </AppBar>
                    </Grid>


                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <Divider sx={{
                            backgroundColor: 'grey.200',
                            margin: '1.5rem 0',
                            width: '80%'
                        }} />
                    </Grid>


                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            component="p"
                            sx={{
                                color: 'grey.500',
                                textAlign: 'center',
                                marginTop: '1rem',
                            }}
                        >
                            © 2024 EBAA PATINHAS. Todos os direitos reservados.
                        </Typography>
                    </Grid>
                </Grid>
            </Container >
        </footer>
    );
}