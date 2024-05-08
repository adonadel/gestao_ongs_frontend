import { AttachMoney, Diversity1, Groups2, Home } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import MenuIcon from '@mui/icons-material/Menu';
import PetsIcon from '@mui/icons-material/Pets';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Avatar, Container, Divider, Grid, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import { Fragment, useEffect, useRef, useState } from 'react';
import { DefaultHeader } from '../header/DefaultHeader';
import { ListItemDrawer } from './ListItemDrawer';

export interface IDrawerProps {
    children: React.ReactNode;
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
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('md')]: {
        width: `calc(${theme.spacing(10)} + 1px)`,
    },
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
}

export const DefaultDrawer = (props: IDrawerProps) => {
    const drawerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [selectedItem, setSelectedItem] = useState<number>(1);

    const drawerList: IListDrawerProps[] = [
        {
            icon: <MenuIcon />,
            text: 'Menu',
            onClick: () => props.setOpen(!props.open),
        },
        {
            icon: <Home />,
            text: 'Início',
            to: '/dashboard',
        },
        {
            icon: <PetsIcon />,
            text: 'Animais',
            to: '/animals',
        },
        {
            icon: <ImageIcon />,
            text: 'Banners',
            to: '/banners',
        },
        {
            icon: <VolunteerActivismIcon />,
            text: 'Doações',
            to: '/donations',
        },
        {
            icon: <AttachMoney />,
            text: 'Financeiro',
            to: '/financial',
        },
        {
            icon: <Diversity1 />,
            text: 'Doadores',
            to: '/givers',
        },
        {
            icon: <Groups2 />,
            text: 'Usuários',
            to: '/users',
        },
    ]


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
            <Grid item xs={12}>
                <DefaultHeader open={props.open} />
            </Grid>
            <Grid item xs={1}>
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open={props.open}
                    ref={drawerRef}
                >
                    <DrawerHeader >
                        <Typography>EBAA Patinhas</Typography>
                    </DrawerHeader>
                    <List >
                        <ListItemButton>
                            <ListItemIcon>
                                <Avatar sx={{ width: 54, height: 54 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography
                                        sx={{
                                            fontSize: '1.25rem',
                                            fontWeight: "500",
                                            marginLeft: '15px'
                                        }}>
                                        Usuario
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
                            <Fragment key={index} >
                                <ListItemDrawer
                                    open={props.open}
                                    icon={item.icon}
                                    text={item.text}
                                    to={item.to}
                                    selected={selectedItem === index}
                                    onClick={item.onClick ? item.onClick : () => setSelectedItem(index)}
                                />
                            </ Fragment>
                        ))}
                    </List>
                </Drawer>
            </Grid>
            <Grid item xs={11}>
                <Container maxWidth='xl'>
                    {props.children}
                </Container>
            </Grid>
        </Grid >
    );
};