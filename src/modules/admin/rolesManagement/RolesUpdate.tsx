import {Button, Stack, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {PermissionValues, RoleValues} from './types';
import baseApi from '../../../lib/api';
import PermissionsList from './PermissionsList';

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
            try {
                const response = await baseApi.get('/api/permissions/?no-paginate=true');
                const permissions = response.data;
                setPermissions(permissions);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPermissions();
    }, [])

    useEffect(() => {
        setIsLoading(true);
        if (isEditMode) {
            const fetchRole = async () => {
                try {
                    const response = await baseApi.get(`/api/roles/${id}`);
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
            if (isEditMode) {
                await baseApi.put(`/api/roles/${id}`, data);
            } else {
                await baseApi.post('/api/roles', data);
            }
            navigate('/roles');
        } catch (error) {
            console.log(error);
        }
    };

    if (isEditMode && !role && isLoading) {
        return <div>Loading...</div>;
    } else {
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
                        {permissions.length > 0 && <PermissionsList permissions={permissions} permissionsToSave={permissionsToSave}
                                          setPermissionsToSave={setPermissionsToSave}/>}
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

export default RolesUpdate;