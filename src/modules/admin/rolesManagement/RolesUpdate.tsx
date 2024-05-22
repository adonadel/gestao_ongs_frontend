import { Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../../shared/reducers/userReducer';
import { getToken } from '../../../shared/utils/getToken';
import PermissionsDialog from './PermissionsDialog';
import { PermissionValues, RoleValues } from './types';

const RolesUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [role, setRole] = useState<RoleValues | null>(null);
    const [permissions, setPermissions] = useState<PermissionValues[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!id;
    const logout = useUserStore(state => state.logout);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchPermissions = async () => {
            const token = getToken();
            try {
                const response = await axios.get(`${apiUrl}/api/permissions/?no-paginate=true`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const permissions = response.data;
                setPermissions(permissions);
            } catch (error) {
                logout();
            }
        };
        fetchPermissions();
        setIsLoading(false);
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchRole = async () => {
                const token = getToken();
                try {
                    const response = await axios.get(`${apiUrl}/api/roles/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const role = response.data;
                    setRole(role);
                } catch (error) {
                    navigate('/login');
                }
            };
            fetchRole();
        }
    }, [id, isEditMode, navigate]);

    const { register, handleSubmit } = useForm<RoleValues>();

    const onSubmit = async (data: RoleValues) => {
        try {
            const token = getToken();
            if (isEditMode) {
                await axios.put(`${apiUrl}/api/roles/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${apiUrl}/api/roles`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            navigate('/roles');
        } catch (error) {
            logout();
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (isEditMode && !role && isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <TextField
                        type="hidden"
                        {...register('id')}
                        defaultValue={isEditMode ? role?.id : ''}
                        sx={{ display: 'none' }}
                    />
                    <TextField
                        label="Nome"
                        type="text"
                        {...register('name')}
                        defaultValue={isEditMode ? role?.name : ''}
                    />
                    <Button variant='contained' color="primary" onClick={handleClickOpen}>
                        Permissões
                    </Button>
                    <PermissionsDialog open={open} onClose={handleClose} permissions={permissions} roleName={role?.name} />
                    <Button type='button' variant='contained' color="primary" onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                    <Button type='submit' variant='contained' color="primary">
                        {isEditMode ? 'Salvar' : 'Criar'}
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default RolesUpdate;