import { Button, Stack, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../shared/utils/getToken';

type AnimalValues = {
    id: number;
    animalName: string;
    gender: string;
    size: string;
    age_type: string;
    description: string;
    tags: string;
};

const AnimalUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<AnimalValues | null>(null);
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchAnimal = async () => {
                try {
                    const token = getToken();
                    const response = await axios.get(`${apiUrl}/api/animals/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const animal = response.data;
                    setAnimal(animal);
                } catch (error) {
                    navigate('/login');
                }
            };
            fetchAnimal();
        }
    }, [id, isEditMode, navigate]);

    const { register, handleSubmit } = useForm<AnimalValues>();

    const onSubmit = async (data: AnimalValues) => {
        try {
            const token = getToken();
            if (isEditMode) {
                await axios.put(`${apiUrl}/api/animals/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${apiUrl}/api/animals`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            navigate('/animals');
        } catch (error) {
            navigate('/login');
        }
    };

    if (isEditMode && !animal) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stack spacing={2}>
                    <TextField
                        type="hidden"
                        {...register('id')}
                        defaultValue={isEditMode ? animal?.id : ''}
                        sx={{ display: 'none' }}
                    />
                    <TextField
                        label="Nome"
                        type="text"
                        {...register('animalName')}
                        defaultValue={isEditMode ? animal?.animalName : ''}
                    />
                    <TextField
                        label="Gênero"
                        type="text"
                        {...register('gender')}
                        defaultValue={isEditMode ? animal?.gender : ''}
                    />
                    <TextField
                        label="Tamanho"
                        type="text"
                        {...register('size')}
                        defaultValue={isEditMode ? animal?.size : ''}
                    />
                    <TextField
                        label="Idade"
                        type="text"
                        {...register('age_type')}
                        defaultValue={isEditMode ? animal?.age_type : ''}
                    />
                    <TextField
                        label="Descrição"
                        type="text"
                        {...register('description')}
                        defaultValue={isEditMode ? animal?.description : ''}
                    />
                    <TextField
                        label="Tags"
                        type="text"
                        {...register('tags')}
                        defaultValue={isEditMode ? animal?.tags : ''}
                    />
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

export default AnimalUpdate;