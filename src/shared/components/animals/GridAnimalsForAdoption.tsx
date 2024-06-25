import { Grid, CircularProgress, Typography, TextField, Button, InputLabel, MenuItem, Select, FormControl, Box, Modal } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { CardAnimalForAdoption } from "./CardAnimalForAdoption";
import { Close, Favorite, FilterAltOutlined, Search, SentimentVeryDissatisfied } from "@mui/icons-material";
import TagTitle from "../tagTitle/TagTitle";

interface Media {
    filename_id: string;
    pivot: {
        is_cover: string;
    }
}

interface AnimalWithDetails {
    id: number;
    name: string;
    gender: string;
    size: string;
    age_type: string;
    castrate_type: string;
    description: string;
    location: string;
    tags: string;
    animal_type: string;
    created_at: string;
    adoption_status: string;
    medias: Media[];
}

interface ApiResponse {
    current_page: number;
    data: AnimalWithDetails[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export const GridAnimalsForAdoption = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [animals, setAnimals] = useState<AnimalWithDetails[]>([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [animalType, setAnimalType] = useState("");
    const [gender, setGender] = useState("");
    const [size, setSize] = useState("");
    const [params, setParams] = useState("");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                setLoading(true);
                const response = await axios.get<ApiResponse>(`${apiUrl}/api/animals?${params}`);
                setAnimals(response.data.data);
            } catch (error) {
                console.error("Erro ao buscar animais:", error);
                setAnimals([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, [apiUrl, params]);

    const constructParams = () => {

        handleClose();
        setParams(`no-pagination=true${search ? `&search=${search}` : ''}${animalType ? `&animal_type=${animalType}` : ''}${gender ? `&gender=${gender}` : ''}${size ? `&size=${size}` : ''}`);
    }

    const clearParams = () => {
        setSearch("");
        setAnimalType("");
        setGender("");
        setSize("");
        setParams("");
    }

    return (
        <Grid container>
            <Grid item xs={12}>

                <Box display={'flex'} alignItems={'center'} gap={2}>
                    <TagTitle backgroundColor="#FABEC025" icon={Favorite} iconColor="#ff4222" />
                    <Typography variant="h2" color="secondary.dark" fontWeight={600}  sx={{
                        fontSize: { xs: '1.2rem', sm: '1.5rem' }
                    }}>
                        Adote um pet
                    </Typography>
                </Box>

                <Typography variant="body1" color="grey.600" mt={2} sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    mb: { xs: '1rem', sm: '2rem' }

                }}>
                    Conheça nossos pets que estão disponíveis para adoção responsável, faça uma busca!
                </Typography>
            </Grid>


            <Grid container xs={12} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: { xs: '70%', sm: '50%' },

                        bgcolor: 'background.paper',
                        border: '2px solid #e0e0e0',
                        borderRadius: '1rem',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" mb={4}>
                            Filtros de busca
                        </Typography>

                        <Grid xs={12} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '1rem',
                        }}>

                            <TextField
                                id="name"
                                label="Nome do animal"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="especie-label">Espécie</InputLabel>
                                <Select
                                    label="Espécie"
                                    labelId="especie-label"
                                    id="especie"
                                    value={animalType}
                                    onChange={(e) => { setAnimalType(e.target.value as string) }}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione uma espécie
                                    </MenuItem>
                                    <MenuItem value="DOG">Cachorro</MenuItem>
                                    <MenuItem value="CAT">Gato</MenuItem>
                                    <MenuItem value="OTHER">Outros</MenuItem>

                                </Select>
                            </FormControl>


                            <FormControl fullWidth>
                                <InputLabel id="genero-label">Gênero</InputLabel>
                                <Select
                                    label="Gênero"
                                    labelId="genero-label"
                                    id="genero"
                                    value={gender}
                                    onChange={(e) => { setGender(e.target.value as string) }}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione um gênero
                                    </MenuItem>
                                    <MenuItem value="MALE">Macho</MenuItem>
                                    <MenuItem value="FEMALE">Fêmea</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="porte-label">Porte do animal</InputLabel>
                                <Select
                                    label="Porte do animal"
                                    labelId="porte-label"
                                    id="porte"
                                    value={size}
                                    onChange={(e) => { setSize(e.target.value as string) }}
                                >
                                    <MenuItem value="" disabled>
                                        Selecione um porte
                                    </MenuItem>
                                    <MenuItem value="SMALL">Pequeno</MenuItem>
                                    <MenuItem value="MEDIUM">Médio</MenuItem>
                                    <MenuItem value="LARGE">Grande</MenuItem>
                                    <MenuItem value="VERY_LARGE">Muito grande</MenuItem>
                                </Select>
                            </FormControl>

                            <Button variant="contained" color="secondary" startIcon={<Search sx={{ color: '#fff' }} />} sx={{
                                padding: '0.5rem 1rem',
                            }} onClick={constructParams}>
                                <Typography variant="h4" color="primary" fontWeight={500} sx={{
                                    fontSize: { xs: '0.8rem', sm: '1rem' }
                                }}>
                                    Pesquisar
                                </Typography>
                            </Button>

                        </Grid>
                    </Box>
                </Modal>

                <Grid item xs={8} sx={{
                    display: { xs: 'none', lg: 'flex' },
                    justifyContent: 'center',
                    gap: '1rem',
                }}>

                    <TextField
                        id="name"
                        label="Nome do animal"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value) }}
                    />

                    <FormControl fullWidth>
                        <InputLabel id="especie-label">Espécie</InputLabel>
                        <Select
                            label="Espécie"
                            labelId="especie-label"
                            id="especie"
                            value={animalType}
                            onChange={(e) => { setAnimalType(e.target.value as string) }}
                        >
                            <MenuItem value="" disabled>
                                Selecione uma espécie
                            </MenuItem>
                            <MenuItem value="DOG">Cachorro</MenuItem>
                            <MenuItem value="CAT">Gato</MenuItem>
                            <MenuItem value="OTHER">Outros</MenuItem>

                        </Select>
                    </FormControl>


                    <FormControl fullWidth>
                        <InputLabel id="genero-label">Gênero</InputLabel>
                        <Select
                            label="Gênero"
                            labelId="genero-label"
                            id="genero"
                            value={gender}
                            onChange={(e) => { setGender(e.target.value as string) }}
                        >
                            <MenuItem value="" disabled>
                                Selecione um gênero
                            </MenuItem>
                            <MenuItem value="MALE">Macho</MenuItem>
                            <MenuItem value="FEMALE">Fêmea</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="porte-label">Porte do animal</InputLabel>
                        <Select
                            label="Porte do animal"
                            labelId="porte-label"
                            id="porte"
                            value={size}
                            onChange={(e) => { setSize(e.target.value as string) }}
                        >
                            <MenuItem value="" disabled>
                                Selecione um porte
                            </MenuItem>
                            <MenuItem value="SMALL">Pequeno</MenuItem>
                            <MenuItem value="MEDIUM">Médio</MenuItem>
                            <MenuItem value="LARGE">Grande</MenuItem>
                            <MenuItem value="VERY_LARGE">Muito grande</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>

                <Grid item xs={12} lg={4} sx={{
                    display: 'flex',
                    justifyContent: { xs: 'space-between', lg: 'flex-end' },
                }}>

                    <Button variant="outlined" color="secondary" startIcon={<FilterAltOutlined sx={{ color: 'secondary' }} />} sx={{
                        padding: '0.5rem 1rem',
                        display: { xs: 'flex', lg: 'none' },
                        justifyContent: 'center',
                    }} onClick={handleOpen}>
                        <Typography variant="h4" color="secondary" fontWeight={500} sx={{
                            fontSize: { xs: '0.6rem', sm: '0.8rem' }
                        }}>
                            Filtros de busca
                        </Typography>
                    </Button>

                    {
                        search || animalType || size || gender ? (

                            <Button variant="text" color="primary" size="small" startIcon={<Close sx={{ color: '#ff0000' }} />} sx={{
                                padding: '0.5rem 1rem',
                                marginRight: '1rem',
                            }} onClick={clearParams}>
                                <Typography variant="h4" color="error" fontWeight={500} sx={{
                                    fontSize: { xs: '0.6rem', sm: '0.8rem' }
                                }}>
                                    Limpar
                                </Typography>
                            </Button>
                        ) : (
                            ''
                        )
                    }

                    <Button variant="contained" color="secondary" startIcon={<Search sx={{ color: '#fff' }} />} sx={{
                        padding: '0.5rem 1rem',
                        display: { xs: 'none', lg: 'flex' },
                        justifyContent: 'center',
                    }} onClick={constructParams}>
                        <Typography variant="h4" color="primary" fontWeight={500} sx={{
                            fontSize: { xs: '0.8rem', sm: '1rem' }
                        }}>
                            Pesquisar
                        </Typography>
                    </Button>
                </Grid>

            </Grid>



            <Grid container spacing={2} xs={12} mt={2}>
                {loading ? (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} mt={8}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            alignItems: 'center',

                        }}>

                            <CircularProgress color="secondary" />

                        </Box>
                    </Grid>
                ) : (
                    animals.length === 0 ? (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                alignItems: 'center',
                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '1rem',
                                padding: '1rem',
                                border: '1px solid #e0e0e0',
                            }}>
                                <TagTitle backgroundColor="grey.100" icon={SentimentVeryDissatisfied} iconColor="grey.500" />

                                <Typography variant="h4" color="grey.500" fontWeight={500} sx={{
                                    fontSize: { xs: '1rem', sm: '1.2rem' }
                                }}>
                                    Nenhum resultado encontrado.
                                </Typography>

                            </Box>
                        </Grid>
                    ) : (

                        animals.map(animal => (
                            <Grid item xs={12} sm={6} md={4} lg={3} >
                                <CardAnimalForAdoption showButton={true} animal={animal} />
                            </Grid>
                        ))
                    )
                )}
            </Grid>
        </Grid>


    );
};
