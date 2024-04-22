import { Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type UserValues = {
    password: string;
    person: {
        email: string;
        name: string;
        cpf_cnpj: string;
    }
    role_id: number;
};

const UserUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const form = useForm<UserValues>({
        defaultValues: {
            password: '',
            person: {
                email: '',
                name: '',
                cpf_cnpj: '',
            },
            role_id: 1,
        },
    });
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const onSubmit = (data: UserValues) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            axios.post(`${apiUrl}/api/users`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
            console.log(data);
        } catch (error) {
            navigate('/login');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        type="email"
                        {...register('person.email', { required: 'E-mail necessário' })}
                        error={!!errors.person?.email}
                        helperText={errors.person?.email?.message}
                    />
                    <TextField
                        label="Nome"
                        type="name"
                        {...register('person.name')}
                    />
                    <TextField
                        label="CPF/CNPJ"
                        type="cpf_cnpj"
                        {...register('person.cpf_cnpj')}
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        {...register('password', { required: 'Senha necessária' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        label="Cargo"
                        type="role_id"
                        {...register('role_id')}
                    />
                    <Button type='button' variant='contained' color="primary" onClick={() => navigate(-1)}>
                        Voltar
                    </Button>
                    <Button type='submit' variant='contained' color="primary">
                        Salvar
                    </Button>
                </Stack>
            </form>
        </>
    );
};

export default UserUpdate;