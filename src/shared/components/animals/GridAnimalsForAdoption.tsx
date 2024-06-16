import { Grid, CircularProgress, Typography, TextField, Button, InputLabel, MenuItem, Select, FormControl, FormLabel, FormHelperText, Box } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { CardAnimalForAdoption } from "./CardAnimalForAdoption";
import { EventAvailable, Favorite, HeartBroken, Search, SentimentVeryDissatisfied } from "@mui/icons-material";
import TagTitle from "../tagTitle/TagTitle";
import { set } from "react-hook-form";

interface Media {
    filename_id: string;
    pivot: {
        is_cover: string;
    }
    // Adicione outras propriedades conforme necessário
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

        setParams(`no-pagination=true${search ? `&search=${search}` : ''}${animalType ? `&animal_type=${animalType}` : ''}${gender ? `&gender=${gender}` : ''}${size ? `&size=${size}` : ''}`);
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h2" color="secondary.dark" fontWeight={600} display={'flex'} alignItems={'center'} gap={2} sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}>
                    <TagTitle backgroundColor="#FABEC025" icon={Favorite} iconColor="#ff4222" />

                    Adote um pet
                </Typography>

                <Typography variant="body1" color="grey.600" mt={2} sx={{
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    mb: { xs: '1rem', sm: '2rem' }

                }}>
                    Conheça nossos pets que estão disponíveis para adoção responsável, faça uma busca!
                </Typography>
            </Grid>


            <Grid item xs={12} sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row',
            }}>
                <Grid xs={8} sx={{
                    display: 'flex',
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

                <Grid>
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

            </Grid>

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
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>

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
                        <Grid item xs={12} sm={6} md={4} lg={3} key={animal.id} height={'fit-content'} mt={2}>
                            <CardAnimalForAdoption animal={animal} />
                        </Grid>
                    ))
                )
            )}
        </Grid>
    );
};
