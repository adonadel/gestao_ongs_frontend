import {Button, Grid, Stack, TextField} from '@mui/material';
import {AxiosResponse} from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useNavigate, useParams} from 'react-router-dom';
import {baseApi} from '../../../lib/api';
import FullLoader from '../../../shared/components/loading/FullLoader';
import useAuthStore from '../../../shared/store/authStore';
import PermissionsList from './PermissionsList';
import {PermissionValues, RoleValues} from './types';

const RolesUpdate: React.FC = () => {
    const navigate = useNavigate();
    const isTokenRefreshed = useRef(false);

    const { id } = useParams<{ id: string }>();
    const [role, setRole] = useState<RoleValues | null>(null);
    const [permissions, setPermissions] = useState<PermissionValues[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isEditMode = !!id;
    const { user, setToken } = useAuthStore(state => ({
        user: state.userData,
        setToken: state.setToken
    }));

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await baseApi.get('/api/permissions/?no-paginate=true');
                const permissions = response.data;
                setPermissions(permissions);
            } catch (error: any) {
                if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                    console.log("Refreshing token...");
                    try {
                        isTokenRefreshed.current = true;
                        const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                        const refreshToken = responseRefreshToken.data.newToken;
                        setToken(refreshToken);
                        fetchPermissions();
                    } catch (error) {
                        navigate('/login');
                    }
                } else {
                    console.error("Failed to fetch users:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchPermissions();
    }, [])

    useEffect(() => {
        if(!user?.role.permissions.filter(permission => permission.name === "role-update").length > 0) {
            navigate('/admin/dashboard');
        }
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
                } catch (error: any) {
                    if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                        console.log("Refreshing token...");
                        try {
                            isTokenRefreshed.current = true;
                            const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                            const refreshToken = responseRefreshToken.data.newToken;
                            setToken(refreshToken);
                            fetchRole();
                        } catch (error) {
                            navigate('/login');
                        }
                    } else {
                        console.error("Failed to fetch users:", error);
                    }
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
            navigate('/admin/roles');
        } catch (error: any) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    onSubmit(data);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to fetch users:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditMode && !role && isLoading) {
        return <FullLoader />;
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
                            setPermissionsToSave={setPermissionsToSave} />}
                    </Stack>

                    <Grid item xs={12} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Button type='button' size='large' variant='contained' color="primary" onClick={() => navigate(-1)} sx={{ width: '20%' }} disabled={isLoading}>
                            Voltar
                        </Button>
                        <Button type='submit' size='large' variant='contained' color="success" sx={{ width: '80%' }} disabled={isLoading}>
                            {isEditMode ? 'Salvar' : 'Criar'}
                        </Button>
                    </Grid>
                </form>
            </>
        );
    }
};

export default RolesUpdate;