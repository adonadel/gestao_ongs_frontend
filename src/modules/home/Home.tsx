import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { HeaderBanner } from '../../shared/headerBanner/HeaderBanner';
import { Grid, Stack } from '@mui/material';
import { CardTransparency } from '../../shared/components/card/CardTransparency';
import { CardAdoption } from '../../shared/components/card/CardAdoption';
import { CardDonate } from '../../shared/components/card/CardDonate';
import { AnimalCarousel } from '../../shared/components/carousel/AnimalCarousel';

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

            <Grid container spacing={4} justifyContent={'center'} alignItems={'strech'} sx={{
                px: { xs: 2, sm: 4, md: 3, lg: 0 },
            }}>
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


            <Grid container justifyContent={'center'} padding={8}>
                <AnimalCarousel />

            </Grid>
            <br />
            <br />
            <br /><br /><br /><br /><br /><br /><br /><br />


        </>
    );
};

export default Home;