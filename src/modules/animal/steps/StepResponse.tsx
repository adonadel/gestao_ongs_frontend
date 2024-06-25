import { Add, East, Favorite } from "@mui/icons-material"
import { Grid, Box, Avatar, Typography, Paper } from "@mui/material"
import useAuthStore from "../../../shared/store/authStore";
import { useEffect, useState } from "react";
import { baseApi } from "../../../lib/api";
import { useParams } from "react-router-dom";
import { Animal } from "./StepConfirm";

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
        <Grid container display={'flex'} alignItems={'center'} spacing={4} justifyContent={"center"} mt={2}>
            <Grid item xs={7} justifyContent={"center"}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>                        
                        <Typography variant="h4" color="grey.700" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' }, fontWeight: 500, }}>Você</Typography>
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
                        }}>{animal.name}</Typography>
                    </Box>

                    <East color="secondary" sx={{
                        opacity: 0.5
                    }} />
                    <Favorite color="error" sx={{
                        fontSize: '2rem',
                    }} />

                </Box>

                <Typography variant="body1" color="initial" sx={{
                    marginTop: '2rem',
                    marginBottom: '2rem',
                }}>
                    {userData?.person?.name}, agrademos a sua candidatura para a adoção de <strong>{animal.name}</strong>, nós estamos muito animados e vamos analisar a sua solicitação com muito carinho.
                </Typography>                

                <Paper elevation={1} sx={{
                    padding: '1rem',
                    marginTop: '1rem',
                    backgroundColor: 'info.main'
                }}>
                    <Typography variant="body2" color="primary">
                        Dentro de alguns dia enviaremos um E-mail para <strong>{userData?.person.email}</strong> com a resposta sobre a adoção.
                    </Typography>
                </Paper>

            </Grid>
        </Grid>
    );
}