import LoginIcon from '@mui/icons-material/Login';
import { Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

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

export const DefaultHeader = (props: IHeaderProps) => {

    return (
        <AppBar position="sticky" open={props.open} >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {!props.open && (
                    <Typography variant="h6" component={Link} to='/'>EBAA Patinhas</Typography>
                )}
                <IconButton component={Link} to="/login" sx={{ marginLeft: 'auto' }}>
                    <LoginIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};
