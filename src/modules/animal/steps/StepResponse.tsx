import { Add, East, Favorite } from "@mui/icons-material"
import { Grid, Box, Avatar, Typography, Paper } from "@mui/material"
import useAuthStore from "../../../shared/store/authStore";
import { useEffect, useState } from "react";
import { baseApi } from "../../../lib/api";
import { useParams } from "react-router-dom";
import { Animal } from "../../../shared/components/animals/CardAnimalForAdoption";

export const StepResponse = () => {
    const { id } = useParams<{ id: string }>();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));
    const [animalProfileImage, setAnimalProfileImage] = useState<string>('');

    const userProfileImage = userData?.person?.profile_picture?.filename_id || '';
    const urlImageApi = import.meta.env.VITE_URL_IMAGE;

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
            if (animal && animal.animal.medias && animal.animal.medias.length > 0) {
                const coverImage = animal.animal.medias.find((media) => media.pivot.is_cover == "true");
                if (coverImage) {
                    setAnimalProfileImage(coverImage.filename_id);
                } else {
                    setAnimalProfileImage(animal.animal.medias[0].filename_id);
                }
            }
        };

        setAnimalImageProfile();
    }, [animal, urlImageApi]);


    if (!animal) {
        return null;
    }

    return (
        <Grid container display={'flex'} alignItems={'center'} spacing={4}>
            <Grid item xs={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>
                        <Avatar src={urlImageApi + userProfileImage} />
                        <Typography variant="h4" color="grey.700" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, fontWeight: 500, }}>{userData?.person.name}</Typography>
                    </Box>

                    <Add color="secondary" sx={{
                        opacity: 0.5
                    }} />

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>
                        <Avatar src={urlImageApi + animalProfileImage} />
                        <Typography variant="h4" color="grey.700" sx={{
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                            fontWeight: 500,
                        }}>{animal.animal.name}</Typography>
                    </Box>

                    <East color="secondary" sx={{
                        opacity: 0.5
                    }} />
                    <Favorite color="error" sx={{
                        fontSize: '2rem',
                    }} />

                </Box>

                <Typography variant="body1" color="initial" sx={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                }}>
                    {userData?.person?.name}, agrademos a sua candidatura para adoção de <strong>{animal.animal.name}</strong>, estamos muito animados com isso.
                </Typography>                

                <Paper elevation={1} sx={{
                    padding: '1rem',
                    marginTop: '1rem',
                    backgroundColor: 'grey.100'
                }}>
                    <Typography variant="body2" color="initial">
                        Nossa equipe precisa de um tempinho para analisar sua solicitação. Enviaremos um E-mail para {userData?.person.email} dentro de alguns dias com a resposta sobre a adoção.
                    </Typography>
                </Paper>

            </Grid>
        </Grid>
    );
}