import {AdminPanelSettings, AttachMoney, Diversity1, EventAvailable, Groups2, Home} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import {Avatar, Divider, Grid, ListItemButton, ListItemIcon, ListItemText, Typography} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import {CSSObject, styled, Theme} from '@mui/material/styles';
import {Fragment, useEffect, useRef, useState} from 'react';
import useAuthStore from '../../store/authStore';
import {ListItemDrawer} from './ListItemDrawer';

export interface IDrawerProps {
    open: boolean;
    setOpen: (value: boolean) => void;
}

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: theme.palette.primary.main,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    backgroundColor: theme.palette.primary.main,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(10)} + 1px)`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

interface IListDrawerProps {
    to?: string;
    selected?: boolean;
    icon: React.ReactNode;
    text: string;
    onClick?: () => void;
    userHasPermissionToAccess: boolean;
}

export const DefaultDrawer = (props: IDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

    const drawerList: IListDrawerProps[] = [
        {
            icon: <MenuIcon />,
            text: 'Menu',
            onClick: () => props.setOpen(!props.open),
            userHasPermissionToAccess: true
        },
        {
            icon: <Home />,
            text: 'Início',
            to: '/admin/dashboard',
            userHasPermissionToAccess: true
        },
        {
            icon: <PetsIcon />,
            text: 'Animais',
            to: '/admin/animals',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "animal-view").length > 0
        },
        {
            icon: <EventAvailable />,
            text: 'Eventos',
            to: '/admin/events',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "event-view").length > 0
        },
        {
            icon: <AttachMoney />,
            text: 'Financeiro',
            to: '/admin/financial',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "finance-view").length > 0
        },
        {
            icon: <Diversity1 />,
            text: 'Adoções',
            to: '/admin/adoptions',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "adoption-view").length > 0
        },
        {
            icon: <AdminPanelSettings />,
            text: 'Níveis de permissão',
            to: '/admin/roles',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "role-view").length > 0
        },
        {
            icon: <Groups2 />,
            text: 'Usuários',
            to: '/admin/users',
            userHasPermissionToAccess: userData?.role.permissions.filter(permission => permission.name === "user-view").length > 0
        },
    ];

    const [selectedItem, setSelectedItem] = useState<number>(() => {
        const index = drawerList.findIndex(item => item.to === window.location.pathname);
        return index !== -1 ? index : 0;
    });

    useEffect(() => {
        const index = drawerList.findIndex(item => item.to === location.pathname);
        if (index !== -1) setSelectedItem(index);
    }, [location.pathname]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const drawerElement = drawerRef.current;
            const headerElement = headerRef.current;

            if (
                drawerElement &&
                !drawerElement.contains(event.target as Node) ||
                headerElement &&
                !headerElement.contains(event.target as Node)
            ) {
                props.setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [props.open]);

    return (
        <Grid container>
            <Grid
                item
            >

                <Drawer
                    anchor="left"
                    variant="permanent"
                    open={props.open}
                    ref={drawerRef}
                >
                    <DrawerHeader >
                        <Typography
                            sx={{
                                fontSize: '1.5625rem',
                                fontWeight: 600,
                                color: 'secondary.main'
                            }}
                        >
                            Patinhas Carentes
                        </Typography>
                    </DrawerHeader>
                    <List >
                        <ListItemButton>
                            <ListItemIcon>
                                <Avatar sx={{ width: 54, height: 54 }} src={`https://drive.google.com/thumbnail?id=${userData?.person.profile_picture?.filename_id}`} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: "500",
                                            marginLeft: '15px'
                                        }}>
                                        {userData?.person.name}
                                    </Typography>
                                }
                                primaryTypographyProps={{
                                    fontFamily: 'Inter',
                                    fontSize: '1.25rem',
                                    fontWeight: 500
                                }}
                            />
                        </ListItemButton>
                        <Divider />
                        {drawerList.map((item, index) => (
                            item.userHasPermissionToAccess ? (
                                <Fragment key={index}>
                                    <ListItemDrawer
                                        open={props.open}
                                        icon={item.icon}
                                        text={item.text}
                                        to={item.to}
                                        selected={selectedItem === index}
                                        onClick={item.onClick ? item.onClick : () => setSelectedItem(index)}
                                    />
                                </Fragment>
                            ) : <></>
                        ))}
                    </List>
                </Drawer>
            </Grid>
        </Grid >
    );
};