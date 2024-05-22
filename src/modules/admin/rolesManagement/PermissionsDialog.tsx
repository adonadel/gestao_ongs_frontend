import { Close, Diversity1, Groups2, VolunteerActivism } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import PetsIcon from '@mui/icons-material/Pets';
import { Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { PermissionsDialogProps, modulesListType } from './types';

const modulesList: modulesListType[] = [
    {
        id: 1,
        title: 'Animais',
        name: 'animal',
        icon: <PetsIcon />
    },
    {
        id: 2,
        title: 'Banners',
        name: 'banner',
        icon: <ImageIcon />
    },
    {
        id: 3,
        title: 'Doadores',
        name: 'giver',
        icon: <Diversity1 />
    },
    {
        id: 4,
        title: 'Doações',
        name: 'donation',
        icon: <VolunteerActivism />
    },
    {
        id: 5,
        title: 'Usuários',
        name: 'user',
        icon: <Groups2 />
    }
];

const PermissionsDialog: React.FC<PermissionsDialogProps> = ({ open, onClose, permissions, roleName }) => {
    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogTitle display='flex' justifyContent='space-between'>
                {roleName != undefined ? roleName : 'Novo Cargo'}
                <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    {modulesList.map((module) => (
                        <Grid item xs={3} key={module.id}>
                            <Paper>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            defaultChecked={true}
                                            color="secondary"
                                        />
                                    }
                                    labelPlacement='start'
                                    label={
                                        <Typography color='secondary' sx={{ display: 'flex', gap: '2px' }}>{module.icon}{module.title}</Typography>
                                    }
                                    sx={{
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        display: 'flex',
                                        marginLeft: '9px',
                                        paddingRight: '9px'
                                    }}
                                />
                                {permissions.filter((permission) => permission.name.includes(module.name)).map((permission) => (
                                    <Stack spacing={2} key={permission.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    defaultChecked={true}
                                                    color="secondary"
                                                />
                                            }
                                            label={permission.name}
                                        />
                                    </Stack>
                                ))}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PermissionsDialog;