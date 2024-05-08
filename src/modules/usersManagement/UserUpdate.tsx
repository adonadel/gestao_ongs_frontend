import { VisibilityOff, Visibility } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, InputBaseComponentProps, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { useNavigate, useParams } from 'react-router-dom';

type UserValues = {
    password: string;
    person: {
        id: number;
        email: string;
        name: string;
        cpf_cnpj: string;
    };
    role_id: number;
};

type RoleValues = {
    id: number;
    name: string;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

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
    const isEditMode = !!id;

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await axios.get(`${apiUrl}/api/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const roles = response.data.data;
                setRoles(roles);
            } catch (error) {
                navigate('/login');
            }
        }
        fetchRoles();
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        throw new Error('No token found');
                    }
                    const response = await axios.get(`${apiUrl}/api/users/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const user = response.data;
                    setUser(user);
                } catch (error) {
                    navigate('/login');
                }
            };
            fetchUser();
        }
    }, [id, isEditMode, navigate]);

    const { register, handleSubmit, formState } = useForm<UserValues>();

    const onSubmit = async (data: UserValues) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            if (isEditMode) {
                await axios.put(`${apiUrl}/api/users/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${apiUrl}/api/users`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            navigate('/users');
        } catch (error) {
            navigate('/login');
        }
    };

    if (isEditMode && !user || !roles.length) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <TextField
                        type="hidden"
                        {...register('person.id')}
                        defaultValue={isEditMode ? user?.person.id : ''}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        {...register('person.email', { required: 'E-mail necessário', pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i, message: 'E-mail inválido' } })}
                        error={!!formState.errors.person?.email}
                        helperText={formState.errors.person?.email?.message}
                        defaultValue={isEditMode ? user?.person.email : ''}
                    />
                    <TextField
                        label="Nome"
                        type="text"
                        {...register('person.name')}
                        defaultValue={isEditMode ? user?.person.name : ''}
                    />
                    <TextField
                        label="CPF/CNPJ"
                        type="text"
                        {...register('person.cpf_cnpj')}
                        defaultValue={isEditMode ? user?.person.cpf_cnpj : ''}
                        InputProps={{
                            inputComponent: TextMaskCustom as unknown as React.ElementType<InputBaseComponentProps>,
                        }}
                    />
                    {!isEditMode && (
                        <TextField
                            label="Senha"
                            type={showPassword ? "text" : "password"}
                            {...register('password', {
                                required: 'Senha necessária', minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }, pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?\\/]{6,}$/
                                    , message: 'Senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, uma minúscula e números'
                                }
                            })}
                            error={!!formState.errors.password}
                            helperText={formState.errors.password?.message}
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
                        />
                    )}
                    <InputLabel id="role-label">Cargo</InputLabel>
                    <Select
                        labelId="role-label"
                        {...register('role_id')}
                        defaultValue={isEditMode ? user?.role_id : roles[0]['id']}
                    >
                        {roles && roles.map((role: RoleValues) => (
                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                        ))}
                    </Select>
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

export default UserUpdate;
