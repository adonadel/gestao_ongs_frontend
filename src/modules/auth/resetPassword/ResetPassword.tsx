import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from 'zod';
import { baseApi } from "../../../lib/api";

interface ResetPassword {
    email: string;
    name: string;
    token: string;
    password: string;
    confirmPassword: string;
}

const passwordSchema = z.object({
    password: z.string()
        .min(6, 'Senha deve ter no mínimo 6 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?\\/]{6,}$/,
            'Senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, uma minúscula e números'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // path of error
});

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
    const query = useQuery();
    const navigate = useNavigate();

    const { register, formState, handleSubmit } = useForm<ResetPassword>({
        resolver: zodResolver(passwordSchema)
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const id = query.get('id');
    const token = query.get('token');

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await baseApi.get(`/api/users/external/${id}`)
            setEmail(response.data.email);
            setName(response.data.name);
        } catch (error) {
            console.log("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = async (data: ResetPassword) => {
        setLoading(true);
        try {
            const response = await baseApi.post(`/api/users/reset-password`, {
                email,
                token,
                password: data.password
            });
            console.log("Password reseted: ", response);
        } catch (error) {
            console.log("Failed to reset the password: ", error)
        } finally {
            setLoading(false);
            navigate('/login')
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Grid container justifyContent="center" alignItems="center" marginTop={4}>
            <Grid item xs={10} sm={8} md={6} lg={4}>
                <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px' }}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl fullWidth margin="normal">
                                <Typography sx={{ fontSize: '2rem' }}>
                                    Olá, {name}!
                                </Typography>
                                <Typography marginBottom={2}>
                                    Por favor, insira sua nova senha.
                                </Typography>
                                <TextField
                                    label='Senha'
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    error={!!formState.errors.password}
                                    helperText={formState.errors.password?.message}
                                    variant='outlined'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label='Confirme a Senha'
                                    type={showPassword ? "text" : "password"}
                                    {...register('confirmPassword')}
                                    error={!!formState.errors.confirmPassword}
                                    helperText={formState.errors.confirmPassword?.message}
                                    variant='outlined'
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
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
        </Grid>
    );
}
