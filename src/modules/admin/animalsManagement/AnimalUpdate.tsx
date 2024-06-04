import { Button, TextField, Grid, Avatar, Box, IconButton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../shared/utils/getToken';
import { Animal } from './types';
import { Loading } from '../../../shared/components/loading/Loading';
import { Filter } from '@mui/icons-material';

const AnimalUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const { register, handleSubmit } = useForm<Animal>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<any>();
    const imageUrl = import.meta.env.VITE_URL_IMAGE;

    const openImagePicker = () => {
        document.getElementById('imagePicker')?.click();
    }


    const handleImageChange = async (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`medias[${index}][media]`, file);
        });

        const token = getToken();
        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/medias/bulk`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })

            setImages(response.data);

        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

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


    const onSubmit = async (data: Animal) => {
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
            // navigate('/login');
        }
    };

    if (isEditMode && !animal) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2} sx={{
                    border: 'solid 0.5px',
                    borderColor: 'primary.light',
                    boxShadow: '0px 4px 4px rgba(55, 55, 55, 0.25)',
                    padding: '20px',
                    borderRadius: '10px'
                }}>

                    <Grid item xs={12}>

                        <TextField
                            type="hidden"
                            {...register('id')}
                            defaultValue={isEditMode ? animal?.id : ''}
                            sx={{ display: 'none' }}
                        />
                        <TextField
                            label="Nome"
                            type="text"
                            {...register('name')}
                            defaultValue={isEditMode ? animal?.name : 'Alfredo'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Espécie"
                            type="text"
                            defaultValue={'DOG'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Gênero"
                            type="text"
                            {...register('gender')}
                            defaultValue={isEditMode ? animal?.gender : 'MALE'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Tamanho"
                            type="text"
                            {...register('size')}
                            defaultValue={isEditMode ? animal?.size : 'SMALL'}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Idade"
                            type="text"
                            {...register('age_type')}
                            defaultValue={isEditMode ? animal?.age_type : 'CUB'}
                        />

                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Castração"
                            type="text"
                            {...register('castrate_type')}
                            defaultValue={isEditMode ? animal?.castrate_type : 'CASTRATED'}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Tags"
                            type="text"
                            {...register('tags')}
                            defaultValue={isEditMode ? animal?.tags : 'tags names'}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            type="text"
                            {...register('description')}
                            defaultValue={isEditMode ? animal?.description : 'Lorem ipsum'}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                            label="Localização do animal"
                            type="text"
                            {...register('location')}
                            defaultValue={isEditMode ? animal?.location : 'centro, rua tal de tal'}
                        />
                    </Grid>

                    <input id='imagePicker' type="file" accept='image/*' multiple onChange={handleImageChange} style={{ visibility: 'hidden', height: '0', width: '0' }} />



                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>


                            {Array.isArray(images) &&
                                images.map((image: any, index: number) => (
                                    <Avatar
                                        key={index}
                                        alt="Imagem"
                                        src={imageUrl+image.filename_id}
                                        variant='rounded'
                                        sx={{ width: '6rem', height: '6rem' }}
                                    />
                                ))
                            }

                            <IconButton
                                onClick={openImagePicker}
                                color="secondary"
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'primary.dark',
                                    borderRadius: '4px',
                                    width: '6rem',
                                    height: '6rem'
                                }}>
                                <Filter />
                            </IconButton>
                        </Box>
                    </Grid>



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


                    {
                        isLoading && (
                            <Loading />
                        )
                    }

                </Grid>
            </form>
        </>
    );
};

export default AnimalUpdate;