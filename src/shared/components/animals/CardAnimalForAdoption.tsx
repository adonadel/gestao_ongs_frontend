import { Cake, Favorite, HeartBroken, Height, Pets, ViewAgenda } from "@mui/icons-material";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";

interface Media {
    filename_id: string;
    pivot: {
        is_cover: string;
    }
    // Adicione outras propriedades conforme necessário
}
interface CardAnimalForAdoptionProps {
    animal: {
        id: number;
        name: string
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
}

export const CardAnimalForAdoption = (props: CardAnimalForAdoptionProps) => {
    const { animal } = props;
    const apiImage = import.meta.env.VITE_URL_IMAGE;
    const { id, name, size, gender, age_type, castrate_type, description, location, tags, animal_type, created_at, adoption_status, medias } = animal;
    const [media, setMedia] = useState<string>("");

    useEffect(() => {
        if (medias && medias.length > 0) {
            const media = medias.find(media => media.pivot && media.pivot.is_cover);
            console.log(media?.filename_id);
            if (media) {
                setMedia(`${apiImage}${media.filename_id}`);
                return;
            } else {
                const media = medias.find(media => media.filename_id);
                setMedia(`${apiImage}${media}`);
            }

        }
    }, [medias]);

    return (
        <Card sx={{ border: "1px solid #e0e0e0", marginBottom: '4rem', borderRadius: '1rem' }}>

            <CardMedia
                component="img"
                height="300"
                image={media ? media : 'https://via.placeholder.com/300'}
                alt="Imagem de animal"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontWeight={600} sx={{
                    color: 'secondary.dark',
                    fontSize: { xs: '1.2rem', sm: '1.5rem'}
                }}>
                    {name}
                </Typography>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    marginTop: '1rem'
                }}>

                    <Box sx={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'

                    }}>
                        {
                            gender === 'MALE' ? <Pets sx={{ color: '#4690FF', width: '1rem' }} /> : <Pets sx={{ color: '#FF46CB', width: '1rem' }} />
                        }

                        <Typography variant="body2" color="text.secondary" sx={{
                            margin: '0'
                        }}>
                            {gender === 'MALE' ? 'Macho' : 'Fêmea'}
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
                                age_type === 'CUB' ? 'Filhote' : age_type === 'TEEN' ? 'Jovem' : age_type === 'ADULT' ? 'Adulto' : 'Idoso'
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
                                size === 'SMALL' ? 'Pequeno' : size === 'MEDIUM' ? 'Médio' : size === 'LARGE' ? 'Grande' : 'Muito grande'
                            }

                        </Typography>
                    </Box>


                </Box>


                <Button fullWidth variant="contained" color="secondary" startIcon={<Favorite sx={{ color: '#FABEC0' }} />} sx={{
                    borderRadius: '100px',
                    py: '0.5rem',
                    boxShadow: 'none'
                }}>
                    <Typography variant="body1" color="primary" fontWeight={600} fontSize={'0.8rem'}>
                        Me conheça
                    </Typography>
                </Button>
            </CardContent>

        </Card >
    )
}