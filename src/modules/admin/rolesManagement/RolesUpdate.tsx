import {Button, Stack, TextField} from '@mui/material';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {getToken} from '../../../shared/utils/getToken';
import PermissionsList from './PermissionsList.tsx';
import {PermissionValues, RoleValues} from './types';

const RolesUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [role, setRole] = useState<RoleValues | null>(null);
    const [permissions, setPermissions] = useState<PermissionValues[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isEditMode = !!id;

    useEffect(() => {
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
                //
            }
        };
        fetchPermissions();
    }, [])

    useEffect(() => {
        setIsLoading(true);
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
                    const permissionsIds = role.permissions.map((permission) => {
                        return permission.id
                    });
                    
                    setRole(role);
                    setPermissionsToSave(permissionsIds);
                } catch (error) {
                    //
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRole();
        }
    }, [id, isEditMode, navigate]);
    
    const [permissionsToSave, setPermissionsToSave] = useState([]);

    const { register, handleSubmit } = useForm<RoleValues>();

    const onSubmit = async (data: RoleValues) => {
        data.permissionsIds = permissionsToSave.join(',');
        
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
            //
        }
    };
    
    if (isEditMode && !role && isLoading) {
        return <div>Loading...</div>;
    }else {
        return (
            <>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            type="hidden"
                            {...register('id')}
                            defaultValue={ isEditMode? role?.id : ''}
                            sx={{ display: 'none' }}
                        />
                        <TextField
                            label="Nome"
                            type="text"
                            {...register('name')}
                            defaultValue={isEditMode ? role?.name : ''}
                        />
                        <PermissionsList permissions={permissions} permissionsToSave={permissionsToSave} setPermissionsToSave={setPermissionsToSave} />
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
    }
};

export default RolesUpdate;