import {
    AdminPanelSettings,
    Diversity1,
    EventAvailable,
    Groups2,
    InsertPhoto,
    TextSnippet,
    Wallet
} from '@mui/icons-material';
import PetsIcon from '@mui/icons-material/Pets';
import {Box, Checkbox, FormControlLabel, Grid, Paper, Stack, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {modulesListType, PermissionsProps} from './types';

const modulesList: modulesListType[] = [
    {
        id: 1,
        title: 'Animais',
        name: 'animal',
        icon: <PetsIcon/>
    },
    {
        id: 2,
        title: 'Adoções',
        name: 'adoption',
        icon: <Diversity1/>
    },
    {
        id: 3,
        title: 'Eventos',
        name: 'event',
        icon: <EventAvailable/>
    },
    {
        id: 4,
        title: 'Imagens',
        name: 'media',
        icon: <InsertPhoto/>
    },
    {
        id: 5,
        title: 'Cargos',
        name: 'role',
        icon: <AdminPanelSettings/>
    },
    {
        id: 6,
        title: 'Permissões',
        name: 'permission',
        icon: <AdminPanelSettings/>
    },
    {
        id: 7,
        title: 'Usuários',
        name: 'user',
        icon: <Groups2/>
    },
    {
        id: 8,
        title: 'Dados Ong',
        name: 'ngr',
        icon: <TextSnippet/>
    },
    {
        id: 9,
        title: 'Finanças',
        name: 'finance',
        icon: <Wallet/>
    }
];

const PermissionsList: React.FC<PermissionsProps> = ({permissions, permissionsToSave, setPermissionsToSave}) => {

    const [checkedModules, setCheckedModules] = useState(
        modulesList.map((module) => ({
            name: module.name,
            checked: false,
            permissions: permissions.filter((permission) => permission.type === module.name).map((permission) => ({
                name: permission.name,
                checked: false,
                id: permission.id,
                type: permission.type,
            })),
        }))    
    );
    
    const [isAllCheckedUpdated, setIsAllCheckedUpdated] = useState(false);

    const handleChangeModule = (event) => {
        const moduleName = event.target.name;
        const isChecked = event.target.checked;
        setCheckedModules((prevCheckedModules) =>
            prevCheckedModules.map((module) =>
                module.name === moduleName
                    ? {
                        ...module,
                        checked: isChecked,
                        permissions: module.permissions.map((permission) => ({
                            ...permission,
                            checked: isChecked,
                        })),
                    }
                    : module
            )
        );        
    };

    const handleChangePermission = (event) => {
        const permissionName = event.target.name;
        const moduleName = event.target.getAttribute('data-module');
        setCheckedModules((prevCheckedModules) =>
            prevCheckedModules.map((module) => {
                if (module.name === moduleName) {
                    return {
                        ...module,
                        permissions: module.permissions.map((permission) =>
                            permission.name === permissionName
                                ? {...permission, checked: event.target.checked}
                                : permission
                        ),
                    };
                }
                return module;
            })
        );
    };
    
    useEffect(() => {
        // @ts-ignore
        setPermissionsToSave(getSelectedPermissions());
        setIsAllCheckedUpdated(true);
        handleAllChecked()
    }, [checkedModules])
    
    const handleAllChecked = () => {
        if (!isAllCheckedUpdated) return;
        setIsAllCheckedUpdated(false);
        
        checkedModules.forEach((module) => {
            let allChecked = true
            module.permissions.forEach((permission) => {
                if(module.name === permission.type && !permission.checked) {
                    allChecked = false;
                }
            })
            setCheckedModules((prevCheckedModules) =>
                prevCheckedModules.map((moduleForChange) => {
                    if (module.name === moduleForChange.name) {
                        if (allChecked) {
                            return {
                                ...moduleForChange,
                                checked: true
                            };
                        }else {
                            return {
                                ...moduleForChange,
                                checked: false
                            };                            
                        }
                    }
                    return moduleForChange;
                })
            );
        })
    }
    
    const initChecks = () => {
        if(permissionsToSave.length > 0) {
            for (const permissionId of permissionsToSave) {
                setCheckedModules((prevCheckedModules) =>
                    prevCheckedModules.map((module) => {
                        return {
                            ...module,
                            permissions: module.permissions.map((permission) =>
                                permission.id === permissionId
                                    ? {...permission, checked: true}
                                    : {...permission}
                            ),
                        };
                    })
                );
            }
        }else {
            setCheckedModules(() =>
                modulesList.map((module) => ({
                    name: module.name,
                    checked: false,
                    permissions: permissions.filter((permission) => permission.type === module.name).map((permission) => ({
                        name: permission.name,
                        checked: false,
                        id: permission.id,
                        type: permission.type,
                    })),
                }))
            );
            
        }
    }
    
    useEffect(() => {
        if(checkedModules) {   
            initChecks();
        }
    }, []);
    
    const getSelectedPermissions = () => {
        const selectedPermissions: number[] = [];
        checkedModules.forEach((module) => {
            module.permissions.filter((permission) => permission.checked).forEach((permission) => {
                selectedPermissions.push(permission.id);
            });
        });
        
        selectedPermissions.sort(function(a, b) {
          return a - b;
        });
        
        return selectedPermissions;
    };

    return (
        <Box>
            <Grid container spacing={2}>
                {modulesList.map((module) => (
                    <Grid item xs={3} key={module.id}>
                        <Paper>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedModules.find((item) => item.name === module.name)?.checked}
                                        color="secondary"
                                        onChange={handleChangeModule}
                                        name={module.name}
                                    />
                                }
                                labelPlacement="start"
                                label={
                                    <Typography color="secondary" sx={{display: 'flex', gap: '2px'}}>
                                        {module.icon}
                                        {module.title}
                                    </Typography>
                                }
                                sx={{
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    display: 'flex',
                                    marginLeft: '9px',
                                    paddingRight: '9px',
                                }}
                            />
                            <Box id={module.name + "Check"}>
                                {permissions.filter((permission) => permission.type === module.name).map((permission) => (
                                    <Stack spacing={2} key={permission.id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkedModules.find((item) => item.name === module.name)?.permissions.find((permissionItem) => permissionItem.name === permission.name)?.checked}
                                                    color="secondary"
                                                    onChange={handleChangePermission}
                                                    name={permission.name}
                                                    // @ts-ignore
                                                    inputProps={{'data-module': module.name}}
                                                />
                                            }
                                            label={permission.name}
                                            name={permission.name}
                                        />
                                    </Stack>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PermissionsList;