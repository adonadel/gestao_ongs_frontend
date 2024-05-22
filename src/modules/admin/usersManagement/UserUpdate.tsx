import { CreateOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { Avatar, Button, Divider, Grid, IconButton, InputAdornment, InputBaseComponentProps, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../../shared/reducers/userReducer';
import { getToken } from '../../../shared/utils/getToken';
import PermissionsDialog from '../rolesManagement/PermissionsDialog';
import { CustomProps, RoleValues, UserValues } from './types';

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        const [mask, setMask] = useState('');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value.replace(/[^\d]/g, '');
            const inputLength = inputValue.length;

            if (inputLength <= 11) {
                setMask('000.000.000-000');
            } else {
                setMask('00.000.000/0000-00');
            }

            onChange({ target: { name: props.name, value: inputValue } });
        }

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                overwrite
                onChange={handleChange}
            />
        );
    },
);

const UserUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserValues | null>(null);
    const [roles, setRoles] = useState<RoleValues[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const logout = useUserStore(state => state.logout);
    const isEditMode = !!id;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickOpen = () => {
        setIsModalOpen(true);
    }

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = getToken();

                const response = await axios.get(`${apiUrl}/api/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const roles = response.data.data;
                setRoles(roles);
                console.log(roles)
            } catch (error) {
                logout();
            }
        }
        fetchRoles();
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const token = getToken();
                    const response = await axios.get(`${apiUrl}/api/users/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const user = response.data;
                    setUser(user);
                } catch (error) {
                    logout();
                }
            };
            fetchUser();
        }
    }, [id, isEditMode, navigate]);

    const { register, handleSubmit, formState } = useForm<UserValues>();


    const onSubmit = async (data: UserValues) => {
        try {
            const token = getToken();

            if (isEditMode) {
                await axios.put(`${apiUrl}/api/users/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                await axios.post(`${apiUrl}/api/users`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            navigate('/users');
        } catch (error) {
            logout();
        }
    };

    if (isEditMode && !user || !roles.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    type="hidden"
                    {...register('person.id')}
                    defaultValue={isEditMode ? user?.person.id : ''}
                    sx={{ display: 'none' }}
                />
                <Grid
                    container
                    spacing={2}
                    sx={{
                        border: 'solid 0.5px',
                        borderColor: 'primary.light',
                        boxShadow: '0px 4px 4px rgba(55, 55, 55, 0.25)',
                        padding: '20px',
                        borderRadius: '10px'
                    }}>
                    <Grid item xs={12} sm={3} md={2}>
                        <label htmlFor='avatar-input'>
                            <Avatar
                                sx={{ width: '116px', height: '116px' }}
                            />
                        </label>
                    </Grid>
                    <Grid item xs={12} sm={9} md={10}>
                        <InputLabel>Nome</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.name')}
                            defaultValue={isEditMode ? user?.person.name : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Email</InputLabel>
                        <TextField
                            type="email"
                            {...register('person.email', { required: 'E-mail necessário', pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i, message: 'E-mail inválido' } })}
                            error={!!formState.errors.person?.email}
                            helperText={formState.errors.person?.email?.message}
                            defaultValue={isEditMode ? user?.person.email : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>CPF/CNPJ</InputLabel>
                        <TextField
                            type="text"
                            fullWidth
                            {...register('person.cpf_cnpj')}
                            defaultValue={isEditMode ? user?.person.cpf_cnpj : ''}
                            variant='outlined'
                            InputProps={{
                                inputComponent: TextMaskCustom as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel id="role-label">Cargo</InputLabel>
                        <Select
                            labelId="role-label"
                            {...register('role_id')}
                            defaultValue={isEditMode ? user?.role_id : roles[0]['id']}
                            variant='outlined'
                            sx={{
                                width: '85%'
                            }}
                        >
                            {roles && roles.map((role: RoleValues) => (
                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                            ))}
                        </Select>
                        <IconButton onClick={handleClickOpen} sx={{ border: '1px solid', borderColor: 'primary.dark', borderRadius: '4px', padding: '15px', marginLeft: '5px' }}>
                            <CreateOutlined />
                        </IconButton>
                    </Grid>
                    {!isEditMode && (
                        <Grid item xs={6}>
                            <InputLabel>Senha</InputLabel>
                            <TextField
                                type={showPassword ? "text" : "password"}
                                disabled={isEditMode}
                                {...register('password', {
                                    required: 'Senha necessária', minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }, pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?\\/]{6,}$/
                                        , message: 'Senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, uma minúscula e números'
                                    }
                                })}
                                error={!!formState.errors.password}
                                helperText={formState.errors.password?.message}
                                variant='outlined'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                        </Grid>
                    )}
                    <Grid xs={12} marginY='10px'>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Endereço</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Estado</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.address.state')}
                            defaultValue={isEditMode ? user?.person?.address?.state : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Cidade</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.address.city')}
                            defaultValue={isEditMode ? user?.person?.address?.city : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Bairro</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.address.neighborhood')}
                            defaultValue={isEditMode ? user?.person?.address?.neighborhood : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Rua</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.address.street')}
                            defaultValue={isEditMode ? user?.person?.address?.street : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel>Número da residência</InputLabel>
                        <TextField
                            type='text'
                            {...register('person.address.number')}
                            defaultValue={isEditMode ? user?.person?.address?.number : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <PermissionsDialog open={isModalOpen} onClose={() => setIsModalOpen(false)} permissions={[]} roleName={''} />
                    <Grid item xs={12}>
                        <Button type='submit' variant='contained' color="success" fullWidth>
                            {isEditMode ? 'Salvar' : 'Criar'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    );
};

export default UserUpdate;
