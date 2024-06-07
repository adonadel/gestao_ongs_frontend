import { Button, TextField, Grid, Avatar, Box, IconButton, Radio, FormControl, RadioGroup, FormControlLabel, InputLabel, Select, MenuItem, FormLabel, FormHelperText, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../../shared/utils/getToken';
import { Animal } from './types';
import { Loading } from '../../../shared/components/loading/Loading';
import { Delete, Filter } from '@mui/icons-material';
import FullLoader from '../../../shared/components/loading/FullLoader';

const AnimalUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const { register, handleSubmit, setValue } = useForm<Animal>();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<any>();
    const imageUrl = import.meta.env.VITE_URL_IMAGE;

    const openImagePicker = () => {
        document.getElementById('imagePicker')?.click();
    }

    const deleteThisImage = (id: number) => {
        return null;
    }

    const setPrincipalImage = async (id: number, e: any) => {
        
        console.log(e)

        const token = getToken(); 

        try {
            await axios.put(`${apiUrl}/api/medias/${id}`, { is_cover: true }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
        } catch (error) {
            console.log("Error:", error);
        }
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
            
            let tmpImages = response.data;

            if (Array.isArray(images)) {
                tmpImages = [...images, ...response.data];
                setImages(tmpImages);
            }

            setImages(tmpImages);

            let imagesId = "";

            response.data.forEach((image : any) => {
                imagesId += image.id.toString() + ',';
                console.log(imagesId)
            });
            
            setValue(`medias`, imagesId);

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
        return <FullLoader />;
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
                                {...register('animal_type')}
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
                                {...register('gender')}
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
                                {...register('size')}
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
                                {...register('age_type')}
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
                                {...register('castrate_type')}
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
                                <RadioGroup aria-label="Imagem de perfil animal" name="radio-group-imagem-perfil-animal" sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems: 'center' }}>



                                    {Array.isArray(images) &&
                                        images.map((image: any, index: number) => (
                                            <Box sx={{ width: '6rem', height: '6rem', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
                                                <Avatar
                                                    key={index}
                                                    alt="Imagem"
                                                    src={imageUrl + image.filename_id}
                                                    variant='rounded'
                                                    sx={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        zIndex: '1'
                                                    }}
                                                />

                                                <FormControlLabel value={image.id} control={<Radio onChange={(e) => setPrincipalImage(image?.id, e)} value={animal?.id} color="success" size='small' sx={{
                                                    color: 'primary.dark',
                                                    '&.Mui-checked': {
                                                        color: 'primary.dark',
                                                    },
                                                    position: 'absolute',
                                                    top: '-0.4rem',
                                                    zIndex: '2',
                                                    left: '-0.4rem',
                                                }} />} label="" />

                                                <IconButton
                                                    color="error"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: '-0rem',
                                                        zIndex: '999',
                                                        right: '-0rem',
                                                    }}>
                                                    <Delete sx={{ fontSize: '1rem' }} />
                                                </IconButton>

                                            </Box>
                                        ))
                                    }
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
        </>
    );
};

export default AnimalUpdate;