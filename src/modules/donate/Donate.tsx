import { useEffect, useState } from "react";
import { baseApi } from "../../lib/api.ts";
import { Message } from "../../shared/components/message/Message.tsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, Grid, Typography, TextField, FormControl, FormLabel, RadioGroup, FormHelperText, FormControlLabel, Radio, Box, Button } from "@mui/material";
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner.tsx";
import { ChevronRight } from "@mui/icons-material";


export const Donate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();


    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [donateValue, setDonateValue] = useState("");

    const otherValue: string = "";

    const presetedDonateValues = [
        {
            id: 1,
            value: "1,00"
        },
        {
            id: 2,
            value: "2,00"
        },
        {
            id: 3,
            value: "5,00"
        },
        {
            id: 4,
            value: "10,00"
        },
        {
            id: 5,
            value: "25,00"
        },
        {
            id: 6,
            value: "50,00"
        },
    ]


    const handleClick = () => {
        console.log('fechou')
    };

    const handleOtherValue = () => {

    };

    const handleDonateValues = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const value = event.target.value;
        setDonateValue(value);        
        //continuar
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
            {/* <HeaderBanner /> */}
            <Container maxWidth="lg">
                <Grid container justifyContent={'center'}>
                    <Grid item xs={6} justifyContent={'flex-end'} sx={{
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Valor para doar" name="donateValue">
                                <Grid container>
                                    {Array.isArray(presetedDonateValues) && presetedDonateValues.map((presetedValue) => (
                                        <Grid item xs={6}>
                                            <Box sx={{
                                                backgroundColor: (presetedValue.id == donateValue) ? "secondary.main" : "grey.200",
                                                margin: '1rem',
                                                padding: '0.5rem 1.5rem',
                                                borderRadius: '1rem',
                                            }}>
                                                <FormControlLabel value={presetedValue.id} control={<Radio color="primary" onChange={handleDonateValues} />} label={`R$ ${presetedValue.value}`} />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </FormControl>
                        <TextField                            
                            id="otherValue"
                            label="Outro valor"
                            value={otherValue}
                            onChange={handleOtherValue}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"     
                            disabled={!donateValue ? true : false}                       
                            startIcon={<ChevronRight fontSize='small' color='primary' />}                            
                            sx={{ padding: '8px 16px', float: "right", marginTop: "1rem" }}
                        >
                            <Typography sx={{ fontSize: '.8125rem', color: 'primary.main' }}>Confirmar</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Container>
            <Message message={message} type={messageType} open={!!message} onClose={handleClick}></Message>
        </>
    );
}