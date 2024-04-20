import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function DefaultAppBar() {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button component={Link} to="/">
                            <img src="logo.png" alt="Logo" />
                        </Button>
                    </Box>
                    <Box>
                        <Button color="inherit">Menu 1</Button>
                        <Button color="inherit">Menu 2</Button>
                        <Button color="inherit">Menu 3</Button>
                        <IconButton component={Link} to="/login"><Person /></IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
