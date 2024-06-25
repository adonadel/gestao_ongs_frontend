import { Add, East, Favorite } from "@mui/icons-material"
import { Grid, Box, Typography, Paper } from "@mui/material"
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


    if (!animal) {
        return null;
    }

    return (
        <Grid container display={'flex'} alignItems={'center'} spacing={4} justifyContent={"center"} mt={2}>
            <Grid item xs={12} sm={7} justifyContent={"center"}>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: "center" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

                <Paper elevation={1} sx={{
                    padding: '1rem',
                    marginTop: '1rem',
                    backgroundColor: 'info.main',
                }}>
                    <Typography variant="body2" color="primary">
                        Dentro de alguns dia enviaremos um E-mail para <strong>{userData?.person.email}</strong> com a resposta sobre a adoção.
                    </Typography>
                </Paper>

            </Grid>
        </Grid>
    );
}