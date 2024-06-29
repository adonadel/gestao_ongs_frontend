import { ChevronRight } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControl, Grid, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { baseApi } from "../../../lib/api";
import { Message } from "../../../shared/components/message/Message";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await baseApi.post(`/api/users/forgot-password`, { email });
            console.log("Email sent: ", response);
        } catch (error) {
            console.error("Failed to send email: ", error);
        } finally {
            setTextMessage("E-mail enviado com sucesso! Verifique sua caixa de entrada ou spam para redefinir sua senha.");
            setTypeMessage("success");
            setOpenMessage(true);
            setLoading(false);
        }
    }

    const handleClose = () => {
        setOpenMessage(false);
    }

    return (
        <Grid container justifyContent="center" alignItems="center" marginTop={4}>
            <Grid item xs={10} sm={8} md={6} lg={4} >
                <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="h5" color="secondary" gutterBottom>Esqueceu a senha?</Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            Insira seu e-mail para recuperar a senha
                        </Typography>
                        <form onSubmit={handleSubmit} >
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    variant="outlined"
                                    color="secondary"
                                    required
                                    id="email"
                                    label="E-mail"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{
                                        'fieldset': { borderRadius: '6px' },
                                    }}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                disabled={loading}
                                startIcon={!loading && <ChevronRight fontSize='small' color='primary' />}
                                sx={{ padding: '8px 16px' }}
                            >
                                {loading ?
                                    <CircularProgress size={24} />
                                    :
                                    <Typography sx={{ fontSize: '.8125rem', color: 'primary.main' }}>Enviar</Typography>
                                }
                            </Button>
                        </form>
                    </Box>
                </Paper>
            </Grid>
            <Message
                message={textMessage}
                type={typeMessage}
                open={openMessage}
                onClose={handleClose}
            />
        </Grid>
    );
}