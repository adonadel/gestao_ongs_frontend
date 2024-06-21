import { useEffect, useState } from "react";
import { Container, Grid, Typography, TextField, FormControl, FormControlLabel, RadioGroup, Radio, Button } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../lib/api.ts";
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner.tsx";
import { Message } from "../../shared/components/message/Message.tsx";
import { ChevronRight } from "@mui/icons-material";

export const Donate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [donateId, setDonateId] = useState("");
    const [otherValue, setOtherValue] = useState("");

    const presetedDonateValues = [
        { id: 1, value: "1,00" },
        { id: 2, value: "2,00" },
        { id: 3, value: "5,00" },
        { id: 4, value: "10,00" },
        { id: 5, value: "25,00" },
        { id: 6, value: "50,00" },
    ];

    useEffect(() => {
        if (location.pathname.includes("success")) {
            handleSuccess();
        } else if (location.pathname.includes("cancel")) {
            handleCancel();
        }
    }, [location.pathname]);

    const handleSuccess = async () => {
        try {
            await baseApi.put(`/api/finances/${id}/success`, {
                message: "Contribuição feita com sucesso."
            });
            setMessage("Contribuição feita com sucesso.");
            setMessageType("success");
            navigate("/");
        } catch (error) {
            handleApiError("Erro ao fazer a contribuição.");
        }
    };

    const handleCancel = async () => {
        try {
            await baseApi.put(`/api/finances/${id}/cancel`, {
                message: "Contribuição cancelada."
            });
            setMessage("Contribuição cancelada.");
            setMessageType("error");
            navigate("/");
        } catch (error) {
            handleApiError("Erro ao cancelar a contribuição.");
        }
    };

    const handleApiError = (errorMessage: any) => {
        setMessage(errorMessage);
        setMessageType("error");
    };

    const handleSubmit = async () => {
        const value = parseFloat(donateId) || parseFloat(otherValue.replace(',', '.')) || 0;

        if (value <= 0) {
            handleApiError("Por favor, selecione ou insira um valor válido.");
            return;
        }

        try {
            const response = await baseApi.post('/api/finances', {
                user_id: 1,
                value: value,
                type: "INCOME",
                description: "Doação",
            });
            window.location.href = response.data.session.url;

        } catch (error) {
            console.error('Ocorreu um erro durante o checkout:', error);
            handleApiError("Ocorreu um erro durante o checkout.");
        }
    };

    const handleDonateValues = (event: any) => {
        const value = event.target.value;
        setDonateId(value);
    };

    const handleOtherValue = (event: any) => {
        const value = event.target.value;
        setOtherValue(value);
        setDonateId(""); // Reset donateId when other value is changed
    };

    return (
        <>
            <HeaderBanner />
            <Container maxWidth="lg">
                <Grid container justifyContent="center">

                    <Grid item xs={12} md={6} sx={{
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }}>
                        <Typography variant="h3" color="initial" sx={{
                            fontSize: '1rem',
                            fontWeight: 400,
                            marginBottom: '1.5rem',

                        }}>
                            Com quanto você pode nos ajudar hoje?
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="Valor para doar" name="donateValue" value={donateId} onChange={handleDonateValues}>
                                <Grid container spacing={{
                                    xs: "0.5rem",
                                    sm: "2rem"
                                }}>
                                    {presetedDonateValues.map((presetedValue) => (
                                        <Grid item key={presetedValue.id} xs={12} sm={6}>
                                            <FormControlLabel
                                                sx={{
                                                    borderRadius: '1rem',
                                                    border: '1px solid #E0E0E0',
                                                    padding: '.5rem',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    '&:hover': {
                                                        backgroundColor: '#F5F5F5',
                                                    }

                                                }}
                                                value={`${presetedValue.id}`}
                                                control={<Radio color="secondary" />}
                                                label={`R$ ${presetedValue.value}`}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </RadioGroup>
                        </FormControl>

                        <Grid container>
                            <Grid xs={12}>
                                <Typography variant="h3" color="initial" sx={{
                                    fontSize: '1rem',
                                    fontWeight: 400,
                                    marginTop: '2rem',
                                    marginBottom: '1.5rem',

                                }}>
                                    Ou insira outro valor
                                </Typography>
                                <TextField
                                    id="otherValue"
                                    label="Outro valor"
                                    value={otherValue}
                                    onChange={handleOtherValue}
                                    fullWidth
                                    type="number"
                                    size="large"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>

                        </Grid>

                        <Grid container>
                            <Grid xs={12} display={'flex'} justifyContent={'center'} mt={4}>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    disabled={!donateId && !otherValue}
                                    onClick={handleSubmit}
                                    startIcon={<ChevronRight fontSize='small' color='primary' />}
                                >
                                    <Typography sx={{ fontSize: '.8125rem', color: 'primary.main' }}>Confirmar</Typography>
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Container>
            <Message message={message} type={messageType} open={!!message} onClose={() => setMessage("")} />
        </>
    );
};