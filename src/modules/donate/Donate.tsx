import { useEffect, useState } from "react";
import { baseApi } from "../../lib/api.ts";
import { Message } from "../../shared/components/message/Message.tsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, FormControl, FormLabel, RadioGroup, FormHelperText } from "@mui/material";
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner.tsx";


export const Donate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();


    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [donateValue, setDonateValue] = useState("");
    const otherValue : string = "";


    const handleClick = () => {
        console.log('fechou')
    };

    const handleDonateValues = () => {
        console.log("Clicou")
    }

    useEffect(() => {
        if (location.pathname.includes("success")) {
            try {
                baseApi.put(`/api/finances/${id}/success`, {
                    message: "Contribuição feita com sucesso."
                })

                setMessage("Contribuição feita com sucesso.");
                setMessageType("success");
                navigate("/")
            }
            catch (error) {
                setMessage("Erro ao fazer a contribuição");
                setMessageType("error");
            }
        }

        if (location.pathname.includes("cancel")) {
            try {
                baseApi.put(`/api/finances/${id}/cancel`, {
                    message: "Contribuição cancelada."
                });

                setMessage("Contribuiçao cancelada.");
                setMessageType("error");
                navigate("/")
            } catch (error) {
                setMessage("Erro ao cancelar a contribuição.");
                setMessageType("error");
            }
        }
    }, []);

    const onSubmit = async () => {
        const dto = {
            "user_id": 1,
            "value": 20.00,
            "type": "INCOME",
            "description": "Stubborn Attachments by Tyler Cowen",
        }

        try {
            const response = await baseApi.post('/api/finances', dto);
            window.location.href = response.data.session.url;

        } catch (error) {
            console.error('Ocorreu um erro durante o checkout:', error);
        }
    };



    return (
        <>
            <HeaderBanner />
            <Container maxWidth="lg">
                <Grid container>
                    <Grid>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Com quanto você pode ajudar hoje?</FormLabel>
                          <RadioGroup aria-label="Valor para doar" name="donateValue" value={donateValue} onChange={handleDonateValues}></RadioGroup>                          
                        </FormControl>

                        <TextField
                            id="otherValue"
                            label="Outro valor"
                            value={otherValue}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Message message={message} type={messageType} open={!!message} onClose={handleClick}></Message>
        </>
    );
}