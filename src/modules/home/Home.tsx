import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { HeaderBanner } from '../../shared/headerBanner/HeaderBanner';
import { Box, Grid, Stack, Container } from '@mui/material';
import { CardTransparency } from '../../shared/components/card/CardTransparency';
import { CardAdoption } from '../../shared/components/card/CardAdoption';
import { CardDonate } from '../../shared/components/card/CardDonate';
import { AnimalCarousel } from '../../shared/components/carousel/AnimalCarousel';
import { GridAnimalsForAdoption } from '../../shared/components/animals/GridAnimalsForAdoption';

const Home: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [typeMessage, setTypeMessage] = useState<string>("success");
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (location.pathname.includes("success")) {
            try {
                axios.put(`${apiUrl}/api/finances/${id}/success`, {
                    message: "Contribuição feita com sucesso."
                })
                setMessage("Contribuição feita com sucesso.");
                setTypeMessage("success");
                setOpenMessage(true);
                navigate("/")
            }
            catch (error) {
                setMessage("Erro ao fazer a contribuição.");
                setTypeMessage("error");
                setOpenMessage(true);
            }
        }

        if (location.pathname.includes("cancel")) {
            try {
                axios.put(`${apiUrl}/api/finances/${id}/cancel`, {
                    message: "Contribuição cancelada."
                });
                setMessage("Contribuição cancelada.");
                setTypeMessage("error");
                setOpenMessage(true);
                navigate("/")
            } catch (error) {
                setMessage("Erro ao cancelar a contribuição.");
                setTypeMessage("error");
                setOpenMessage(true);
            }
        }
    }, []);

    return (
        <>
            <HeaderBanner></HeaderBanner>
            <Container maxWidth="lg">

                <Grid container spacing={4} justifyContent={'center'} alignItems={'strech'}>
                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardAdoption />
                    </Grid>

                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardDonate />
                    </Grid>

                    <Grid item xs={12} sm={8} md={4} lg={3}>
                        <CardTransparency />
                    </Grid>
                </Grid>


                <Grid container sx={{
                    paddingY: 10,
                }}>
                    <Grid item xs={12} >
                        <AnimalCarousel />
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <GridAnimalsForAdoption />
                    </Grid>
                </Grid>



                <br />
                <br />
                <br /><br /><br /><br /><br /><br /><br /><br />
            </Container>

        </>
    );
};

export default Home;