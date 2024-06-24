import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../lib/api";
import { GridAnimalsForAdoption } from "../../shared/components/animals/GridAnimalsForAdoption";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import { AnimalProfileCarousel } from "../../shared/components/carousel/AnimalProfileCarousel";
import { Cake, Favorite, Height, Pets } from "@mui/icons-material";


interface Medias {
    id: number;
    filaname_id: string;
}

interface Animal {
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
    adoption_status: string;
    medias: Medias[];
}

export const AnimalAdoption = () => {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

        try {
            baseApi.get(`/api/animals/${id}`).then((response) => {

                setAnimal(response.data);
            });

        } catch (error) {
            console.log(error);
            navigate('/');
        }

    }, [id]);

    return (

        <Container>
            <Grid container spacing={4} sx={{
                marginTop: { xs: '0rem', sm: '2rem'}
            }}>

                <Grid item xs={12} md={4}>
                    <AnimalProfileCarousel media={animal?.medias} />
                </Grid>
                <Grid item xs={12} md={8} alignItems={"center"}>
                    {animal ? (
                        <Box>
                            <Typography variant="h2" color="grey.800" sx={{
                                fontSize: { xs: '1.5rem', sm: '2rem' },
                                fontWeight: 600,
                                marginBottom: '1rem'

                            }}>
                                {animal.name}
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '1rem',
                                marginBottom: '1rem'

                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'

                                }}>
                                    {
                                        animal.gender === 'MALE' ? <Pets sx={{ color: '#4690FF', width: '1rem' }} /> : <Pets sx={{ color: '#FF46CB', width: '1rem' }} />
                                    }

                                    <Typography variant="body2" color="text.secondary" sx={{
                                        margin: '0'
                                    }}>
                                        {animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'

                                }}>
                                    <Cake sx={{ color: 'grey.400', width: '1rem' }} />
                                    <Typography variant="body2" color="text.secondary">

                                        {
                                            animal.age_type === 'CUB' ? 'Filhote' : animal.age_type === 'TEEN' ? 'Jovem' : animal.age_type === 'ADULT' ? 'Adulto' : 'Idoso'
                                        }
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'

                                }}>
                                    <Height sx={{ color: 'grey.400', width: '1rem' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {
                                            animal.size === 'SMALL' ? 'Pequeno' : animal.size === 'MEDIUM' ? 'Médio' : animal.size === 'LARGE' ? 'Grande' : 'Muito grande'
                                        }

                                    </Typography>
                                </Box>
                            </Box>


                            <Typography variant="body1" color="grey.600" sx={{
                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                marginBottom: '1rem'
                            }}>
                                {animal.description}
                            </Typography>
                      
                            <Button onClick={() => navigate(`/adoption/${animal.id}`)} size="large" variant="contained" color="secondary" startIcon={<Favorite color="primary" />} sx={{
                                marginRight: '1rem',
                                borderRadius: '2rem',
                                boxShadow: 'none',
                                width: { xs: '100%', sm: 'auto'}
                            }}>
                                <Typography variant="body1" color="primary" sx={{
                                    fontWeight: 600,
                                    fontSize: '0.8rem',
                                    opacity: 0.8
                                }}>

                                    Adotar {animal.name}
                                </Typography>
                            </Button>

                        </Box>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Grid>
            </Grid>

            <Grid container mt={10}>
                <GridAnimalsForAdoption />
            </Grid>
        </Container>


    )
}