import LoginIcon from '@mui/icons-material/Login';
import { Avatar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
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

    return (
        user ? (
            <IconButton component={Link} to={userType === 'INTERNAL' ? "/admin/user" : "/external"} sx={{ marginLeft: 'auto' }}>
                <Typography sx={{ fontSize: '1rem', marginRight: '16px', color: 'common.black' }}>Minha conta</Typography> <Avatar src={`https://drive.google.com/thumbnail?id=${user?.person.profile_picture?.filename_id}`} />
            </IconButton>
        ) : (
            <IconButton component={Link} to="/login" sx={{ marginLeft: 'auto' }}>
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
                    <IsLogged user={user} />
                </Toolbar>
            </AppBar>

        </>
    );
};

export default DefaultHeader;