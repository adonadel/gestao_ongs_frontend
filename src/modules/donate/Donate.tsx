import { useEffect, useState } from "react";
import { Container, Grid, Typography, TextField, FormControl, FormControlLabel, RadioGroup, Radio, Button, InputAdornment, CircularProgress } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { baseApi } from "../../lib/api.ts";
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner.tsx";
import { Message } from "../../shared/components/message/Message.tsx";
import { ChevronRight } from "@mui/icons-material";
import useAuthStore from "../../shared/store/authStore.ts";

export const Donate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [donateId, setDonateId] = useState("");
    const [otherValue, setOtherValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);    
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

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
            navigate("/donate/thanks");
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
        } catch (error) {
            handleApiError("Erro ao cancelar a contribuição. Teste novamente");
        }
    };

    const handleApiError = (errorMessage: any) => {
        setMessage(errorMessage);
        setMessageType("error");
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const value = presetedDonateValues.find((item) => item.id === parseInt(donateId))?.value.replace(',', '.') || parseFloat(otherValue.replace(',', '.')) || 0;

        if (Number(value) <= 0) {
            handleApiError("Por favor, selecione ou insira um valor válido.");
            return;
        }

        if (userData){
            try {
                const response = await baseApi.post('/api/finances', {
                    user_id: userData.id,
                    value: Number(value),
                    type: "INCOME",
                    description: "Doação",
                });

                setIsLoading(false);
                window.location.href = response.data.session.url;
    
            } catch (error) {
                console.error('Ocorreu um erro durante o checkout:', error);
                handleApiError("Ocorreu um erro durante o checkout.");
            }
        } else {
            try {
                const response = await baseApi.post('/api/finances', {                    
                    value: Number(value),
                    type: "INCOME",
                    description: "Doação",
                });
                
                setIsLoading(false);
                window.location.href = response.data.session.url;
    
            } catch (error) {
                console.error('Ocorreu um erro durante o checkout:', error);
                handleApiError("Ocorreu um erro durante o checkout.");
            }
        }

    };

    useEffect(() => {
        const cleaned = otherValue.replace(/[^0-9\,]/g, '');
        const parts = cleaned.split(',');
        const integerPart = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let decimalPart = '';
        let onlyComma = false;

        if (parts.length > 1) {
            decimalPart = parts[1].slice(0, 2);
            if (decimalPart.length === 0) {
                onlyComma = true;
            }
        }

        const formatted = `${integerPart}${decimalPart || onlyComma ? `,${decimalPart}` : ''}`;

        setOtherValue(formatted);
        setDonateId("");
    }, [otherValue]);

    return (
        <>
            <HeaderBanner />
            <Container maxWidth="lg">
                <Grid container justifyContent={"center"} alignItems={"center"}>
                    <Grid item xs={6} sx={{ display: { xs: "none", md: "block" } }}>
                        <Typography variant="h3" color="initial" sx={{
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            marginBottom: '2rem',
                        }}>
                            Sua ajuda é muito importante pra gente.
                        </Typography>
                        <img src="/image-checkout-donate.svg" alt="Doação" style={{
                            width: '70%',
                            height: 'auto',
                            marginTop: '2rem',


                        }} />
                    </Grid>

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
                            <RadioGroup aria-label="Valor para doar" name="donateValue" value={donateId} onChange={(e) => { setDonateId(e.target.value) }}>
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
                                                control={<Radio size="small" color="secondary" />}
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
                                    id="outlined-adornment-amount"
                                    label="Outro valor"
                                    size="medium"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    }}
                                    value={otherValue}
                                    onChange={(e) => setOtherValue(e.target.value)}
                                />

                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid xs={12} display={'flex'} justifyContent={'center'} mt={4}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    disabled={!donateId && !otherValue}
                                    onClick={handleSubmit}
                                    startIcon={
                                        isLoading ? <CircularProgress size={20} color="primary" /> : <ChevronRight fontSize='small' color='primary' />
                                    }
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