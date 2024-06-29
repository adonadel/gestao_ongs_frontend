import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Box, Button, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../../modules/admin/usersManagement/types';
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

const IsLogged = ({ user }: { user: User | null }) => {
    const userType = user?.type;
    const navigate = useNavigate();

    const onClick = () => {
        navigate(userType === 'INTERNAL' ? "/admin/user" : "/external")
    }

    return (
        user ? (
            <Button
                variant='text'
                onClick={onClick}
                endIcon={<Avatar src={`https://drive.google.com/thumbnail?id=${user?.person.profile_picture?.filename_id}`} />}
                sx={{ textTransform: 'none', color: 'common.black' }}
            >
                <Typography sx={{ fontSize: '1rem', marginRight: '16px', color: 'common.black' }}>Minha conta</Typography>
            </Button>
        ) : (
            <IconButton component={Link} to="/login" sx={{ marginLeft: 'auto', backgroundColor: 'transparent' }}>
                <LoginIcon />
            </IconButton>
        )
    );
}

const DefaultHeader = (props: IHeaderProps) => {
    const user = useAuthStore(state => state.userData);

    return (
        <>
            <AppBar position="sticky" open={props.open} >
                <Toolbar>
                    {!props.open && (
                        <Box sx={{ flexGrow: 1 }}>
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
                                Patinhas Carentes
                            </Typography>
                        </Box>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box>
                        <IsLogged user={user} />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default DefaultHeader;