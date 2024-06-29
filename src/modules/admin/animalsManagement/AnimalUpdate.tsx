import { Delete, Filter } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { baseApi } from "../../../lib/api.ts";
import FullLoader from '../../../shared/components/loading/FullLoader';
import { Loading } from '../../../shared/components/loading/Loading';
import useAuthStore from '../../../shared/store/authStore.ts';
import { Animal } from './types';

const AnimalUpdate: React.FC = () => {
    const navigate = useNavigate();
    const isTokenRefreshed = useRef(false);

    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const { register, handleSubmit, setValue, formState } = useForm<Animal>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<any>();
    const imageUrl = import.meta.env.VITE_URL_IMAGE;
    const [imagesId, setImagesId] = useState<string>("");
    const { user, setToken } = useAuthStore(state => ({
        user: state.userData,
        setToken: state.setToken
    }));

    const openImagePicker = () => {
        document.getElementById('imagePicker')?.click();
    }

    const handleDeleteImage = async (id: number) => {
        try {
            baseApi.delete(`/api/medias/${id}`);
        } catch (error: any) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    handleDeleteImage(id);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to submit animals:", error);
            }
        } finally {
            setIsLoading(false);
        }
        const updatedImages = images.filter((image: any) => image.id !== id);

        const updatedImagesId = updatedImages.map((image: any) => image.id).join(",");

        setImages(updatedImages);
        setImagesId(updatedImagesId);
        setValue(`medias`, updatedImagesId);
    }

    const handleImageSelect = async (imageId: number) => {
        const updateImageCoverStatus = async (id: number, isCover: boolean) => {
            try {
                const response = await baseApi.post(
                    `/api/medias/${id}`,
                    { is_cover: isCover, origin: 'animal' }
                );
            } catch (error: any) {
                if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                    console.log("Refreshing token...");
                    try {
                        isTokenRefreshed.current = true;
                        const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                        const refreshToken = responseRefreshToken.data.newToken;
                        setToken(refreshToken);
                        handleImageSelect(imageId);
                    } catch (error) {
                        navigate('/login');
                    }
                } else {
                    console.error("Failed to submit animals:", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        await updateImageCoverStatus(imageId, true);
        const updatePromises = images
            .filter((image: any) => image.id !== imageId)
            .map((image: any) => updateImageCoverStatus(image.id, false));

        await Promise.all(updatePromises);

        setImages(images.map((image: any) =>
            image.id === imageId ? { ...image, is_cover: true } : { ...image, is_cover: false }
        ));
    };

    const handleImageChange = async (e: any) => {
        const files: File[] = Array.from(e.target.files);
        const formData = new FormData();

        files.forEach((file, index) => {
            formData.append(`medias[${index}][media]`, file);
        });


        if (isEditMode) {
            formData.append('animal_id', id);
        }

        setIsLoading(true);

        try {
            const response = await baseApi.post(`/api/medias/bulk`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            let tmpImages = response.data;

            if (Array.isArray(images)) {
                tmpImages = [...images, ...response.data];
            }

            setImages(tmpImages);

            const newIds = tmpImages.map((image: any) => image.id).join(',');
            const updatedImagesId = imagesId ? `${imagesId},${newIds}` : newIds;
            setImagesId(updatedImagesId);

            setValue(`medias`, updatedImagesId);

        } catch (error: any) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    handleImageChange(e);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to submit animals:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!user?.role.permissions.filter(permission => permission.name === "animal-update").length > 0) {
            navigate('/admin/dashboard');
        }

        if (isEditMode) {
            const fetchAnimal = async () => {
                try {
                    const response = await baseApi.get(`/api/animals/${id}`);
                    const animal = response.data;
                    setAnimal(animal);
                    setImages(animal.medias);
                } catch (error: any) {
                    if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                        console.log("Refreshing token...");
                        try {
                            isTokenRefreshed.current = true;
                            const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                            const refreshToken = responseRefreshToken.data.newToken;
                            setToken(refreshToken);
                            fetchAnimal();
                        } catch (error) {
                            navigate('/login');
                        }
                    } else {
                        console.error("Failed to fetch animal:", error);
                    }
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAnimal();
        }
    }, [id, isEditMode, navigate]);


    const onSubmit = async (data: Animal) => {
        try {
            if (isEditMode) {
                await baseApi.put(`/api/animals/${id}`, data);
            } else {
                await baseApi.post(`/api/animals`, data);
            }
            navigate('/admin/animals');
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
                console.error("Failed to submit animals:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditMode && !animal) {
        return <FullLoader />;
    }

    return (
        <>
            <Typography variant="h3" fontSize={'2rem'} marginTop='20px' fontWeight={'medium'}>{isEditMode ? 'Editar' : 'Criar'} animal</Typography>
            <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px', marginTop: '10px', maxWidth: '650px' }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container alignItems="center" spacing={2}>
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
                                {...register('name', { required: 'Nome é necessário' })}
                                error={!!formState.errors.name}
                                helperText={formState.errors.name?.message}
                                defaultValue={isEditMode ? animal?.name : ''}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="especie-label">Espécie do animal</InputLabel>
                                <Select
                                    labelId="especie-label"
                                    label="Espécie do animal"
                                    id="especie"
                                    {...register('animal_type', { required: 'Espécie é necessário' })}
                                    defaultValue={isEditMode ? animal?.animal_type : ''}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione a espécie do animal
                                    </MenuItem>
                                    <MenuItem value="DOG">Cachorro</MenuItem>
                                    <MenuItem value="CAT">Gato</MenuItem>
                                    <MenuItem value="OTHER">Outro</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="genero-label">Gênero do animal</InputLabel>
                                <Select
                                    labelId="genero-label"
                                    label="Gênero do animal"
                                    id="genero"
                                    {...register('gender', { required: 'Gênero é necessário' })}
                                    defaultValue={isEditMode ? animal?.gender : ''}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione a gênero do animal
                                    </MenuItem>
                                    <MenuItem value="MALE">Macho</MenuItem>
                                    <MenuItem value="FEMALE">Fêmea</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="porte-label">Porte do animal</InputLabel>
                                <Select
                                    labelId="porte-label"
                                    label="Porte do animal"
                                    id="porte"
                                    {...register('size', { required: 'Porte é necessário' })}
                                    defaultValue={isEditMode ? animal?.size : ''}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione o porte do animal
                                    </MenuItem>
                                    <MenuItem value="SMALL">Pequeno</MenuItem>
                                    <MenuItem value="MEDIUM">Médio</MenuItem>
                                    <MenuItem value="LARGE">Grande</MenuItem>
                                    <MenuItem value="VERY_LARGE">Muito Grande</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="idade-label">Idade do animal</InputLabel>
                                <Select
                                    label="Idade do animal"
                                    labelId="idade-label"
                                    id="idade"
                                    {...register('age_type', { required: 'Idade é necessário' })}
                                    defaultValue={isEditMode ? animal?.age_type : ''}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione a idade do animal
                                    </MenuItem>
                                    <MenuItem value="CUB">Bebê</MenuItem>
                                    <MenuItem value="TEEN">Jovem</MenuItem>
                                    <MenuItem value="ADULT">Adulto</MenuItem>
                                    <MenuItem value="ELDERLY">Idoso</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="castracao-label">Status de castração</InputLabel>
                                <Select
                                    label="Status de castração"
                                    labelId="castracao-label"
                                    id="castracao"
                                    {...register('castrate_type', { required: 'Status de castração é necessário' })}
                                    defaultValue={isEditMode ? animal?.castrate_type : ''}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione o status de castração do animal
                                    </MenuItem>
                                    <MenuItem value="CASTRATED">Castrado</MenuItem>
                                    <MenuItem value="NOT_CASTRATED">Não castrado</MenuItem>
                                    <MenuItem value="AWAITING_CASTRATION">Aguardando castração</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>


                        <Grid item xs={6}>
                            <TextField
                                label="Tags"
                                type="text"
                                {...register('tags')}
                                defaultValue={isEditMode ? animal?.tags : ''}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                label="Descrição ou resumo do animal"
                                multiline minRows={4} maxRows={6}

                                type="text"
                                {...register('description')}
                                defaultValue={isEditMode ? animal?.description : ''}
                            />

                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                label="Localização do animal"
                                type="text"
                                {...register('location')}
                                defaultValue={isEditMode ? animal?.location : ''}
                            />
                        </Grid>

                        <input id='imagePicker' type="file" accept='image/*' multiple onChange={handleImageChange} style={{ visibility: 'hidden', height: '0', width: '0' }} />

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

                                <FormControl component="fieldset">
                                    <RadioGroup defaultValue={
                                        Array.isArray(images) && images.find((image: any) => image.is_cover)?.id
                                    } aria-label="Imagem de perfil animal" name="radio-group-imagem-perfil-animal" sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>
                                        {Array.isArray(images) &&
                                            images.map((image) => (
                                                <Box key={image.id} sx={{ width: '6rem', height: '6rem', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <Avatar
                                                        alt="Imagem"
                                                        src={imageUrl + image.filename_id}
                                                        variant='rounded'
                                                        sx={{
                                                            position: 'absolute',
                                                            width: '100%',
                                                            height: '100%',
                                                            zIndex: '1',
                                                        }}
                                                    />

                                                    {
                                                        isEditMode && (
                                                            <FormControlLabel
                                                                value={image.id}
                                                                control={
                                                                    <Radio
                                                                        onChange={() => handleImageSelect(image.id)}
                                                                        color="success"
                                                                        size='small'

                                                                        sx={{
                                                                            color: 'primary.dark',
                                                                            '&.Mui-checked': {
                                                                                color: 'secondary.main',
                                                                            },
                                                                            '&:hover': {
                                                                                backgroundColor: 'primary.main',
                                                                            },
                                                                            position: 'absolute',
                                                                            top: '-0.6rem',
                                                                            padding: '0.2rem',
                                                                            zIndex: '2',
                                                                            left: '-0.6rem',
                                                                            backgroundColor: 'primary.main',

                                                                        }}
                                                                    />
                                                                }
                                                                label=""
                                                            />
                                                        )
                                                    }

                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '0',
                                                            zIndex: '999',
                                                            right: '0',
                                                        }}>
                                                        <Delete sx={{
                                                            fontSize: '0.8rem',
                                                            backgroundColor: 'white',
                                                            borderRadius: '50%',
                                                            padding: '0.2rem',

                                                        }} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                    </RadioGroup>
                                </FormControl>



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

                        <Grid item xs={12}>
                            <Divider />
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
                </form >
            </Paper>
        </>
    );
};

export default AnimalUpdate;