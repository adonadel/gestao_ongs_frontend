import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseApi } from "../../../lib/api";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import useAuthStore from "../../../shared/store/authStore";
import { Add, East, Favorite } from "@mui/icons-material";
import { CardAnimalForAdoption } from "../../../shared/components/animals/CardAnimalForAdoption";


export interface Media {
    filename_id: string;
    pivot: {
        is_cover: string;
    }
}
export interface Animal {
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

export const StepConfirm = () => {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const urlImageApi = import.meta.env.VITE_URL_IMAGE;
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));
    const [animalProfileImage, setAnimalProfileImage] = useState<string>('');

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const response = await baseApi.get(`/api/animals/${id}`);
                setAnimal(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAnimal();
    }, [id]);

    useEffect(() => {
        const setAnimalImageProfile = () => {
            if (animal && animal.medias && animal.medias.length > 0) {
                const coverImage = animal.medias.find((media) => media.pivot.is_cover == "true");
                if (coverImage) {
                    setAnimalProfileImage(coverImage.filename_id);
                } else {
                    setAnimalProfileImage(animal.medias[0].filename_id);
                }
            }
        };

        setAnimalImageProfile();
    }, [animal, urlImageApi]);


    if (!animal) {
        return null;
    }

    return (
        <Grid container display={'flex'} alignItems={'center'} spacing={0} justifyContent={"center"} sx={{
            marginBottom: { xs: '2rem', sm: '0rem'}
        }}>
            <Grid item xs={10} sm={5} justifyContent={"center"} sx={{
                marginTop: { xs: '-2rem', sm: '0rem' },
            }}>
                <CardAnimalForAdoption showButton={false} animal={animal} heightImage="160" scaleCard="0.7" />
            </Grid>
            <Grid item xs={8} sm={7}>
                <Typography variant="body1" color="initial" sx={{
                    marginBottom: '1rem',
                    marginTop: { xs: '-2rem', sm: '0rem' },
                    
                }}>
                    Olá {userData?.person?.name}, muito obrigado pelo interesse em dar um lar para {animal.gender == 'MALE' ? "o nosso amiguinho" : "a nossa amiguinha"} <strong>{animal.name}</strong>!
                </Typography>

                <Typography variant="body2" color="initial" sx={{
                    
                }}>
                    Só precisamos que você confirme. Vale destacar que a solicitação não garante a adoção do animal.
                </Typography>
            </Grid>
        </Grid>
    );
};
