import { Person } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Box, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export interface IHeaderProps {
    open: boolean;
    setOpen?: (value: boolean) => void;
}

const drawerWidth = 280;
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const IsLogged = () => {
    const user = useAuthStore(state => state.userData);

    return (
        user ? (
            <IconButton component={Link} to="/user" sx={{ marginLeft: 'auto' }}>
                <Person />
            </IconButton>
        ) : (
            <IconButton component={Link} to="/login" sx={{ marginLeft: 'auto' }}>
                <LoginIcon />
            </IconButton>
        )
    );
}

const DefaultHeader = (props: IHeaderProps) => {

    return (
        <>

            <AppBar position="sticky" open={props.open} >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {!props.open && (
                        <Typography
                            component={Link}
                            to='/'
                            sx={{
                                fontSize: '1.5625rem',
                                fontWeight: 600,
                                color: 'secondary.main',
                                textDecoration: 'none',
                            }}
                        >
                            EBAA Patinhas
                        </Typography>
                    )}
                    <IsLogged />
                </Toolbar>
            </AppBar>


            <Box sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
                justifyContent: 'center',
                gap: '2rem',
                height: '400px',
                width: '100vw',
                backgroundColor: 'background.default',
                color: 'text.primary',                
            }}>


                <Typography variant="h5" component="h2" gutterBottom sx={{
                    zIndex: 1,
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '1.8rem',
                    marginLeft: '4rem',
                }}>
                    "Amor pela vida, <br /> amor por amparar."
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '1rem',
                    marginLeft: '4rem',
                    zIndex: 1,
                }}>
                    <Typography variant="h1" component="h1" sx={{
                        color: 'primary.main',
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                        <Avatar src='public\logoPatinhas.svg' sx={{
                            width: '4rem',
                            height: '4rem',
                        }} />

                        <Typography variant="h2" component="h3">
                            <Typography variant="h5" component="h3" sx={{
                                fontWeight: 800,
                                color: 'primary.main',
                            }}>
                                Patinhas Carentes
                            </Typography>

                            <Typography sx={{
                                color: 'primary.main',
                                fontWeight: 500,                                
                            }}>
                                Braço do Norte - SC
                            </Typography>

                        </Typography>

                    </Typography>

                </Box>
                <img src="public\background-header.jpg" alt="Banner" style={{
                    position: 'absolute',
                    marginBottom: '32px',
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100vw',
                    userSelect: 'none',
                }} />

            </Box>
        </>
    );
};

export default DefaultHeader;