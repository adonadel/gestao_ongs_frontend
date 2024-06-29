import { ChevronRight, KeyboardBackspace } from "@mui/icons-material";
import { Box, Button, Grid, Paper, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { baseApi } from "../../../lib/api";
import { Message } from "../../../shared/components/message/Message";
import useAuthStore from "../../../shared/store/authStore";
import { ExternalUser } from "../../admin/usersManagement/types";
import StepAddress from "./Steps/StepAddress";
import StepPerfil from "./Steps/StepPerfil";
import StepUser from "./Steps/StepUser";

const steps = [
    'Perfil',
    'Endereço',
    'Registro de acesso',
];

export default function Register() {
    const theme = useTheme();
    const navigate = useNavigate();

    const methods = useForm<ExternalUser>();
    const [activeStep, setActiveStep] = useState(0);
    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);
    const [loading, setLoading] = useState(false); const { signIn } = useAuthStore((state) => ({
        signIn: state.setLoginInfo,
    }));
    const { logged } = useAuthStore((state) => ({ logged: state.setLogin }));
    const { userMe } = useAuthStore((state) => ({
        userMe: state.setUserData,
    }));

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <StepPerfil />;
            case 1:
                return <StepAddress />;
            case 2:
                return <StepUser />;
            default:
                throw new Error('Unknown step');
        }
    }

    const getUserData = async () => {
        try {
            const response = await baseApi.get(`/api/auth/me`);

            if (response.status === 200) {
                userMe(response.data)
            }
        } catch (error) {
            console.error("Failed to get user data: ", error);
        }
    };

    const onSubmit = async (data: ExternalUser) => {
        setLoading(true);
        const email = data.person.email;
        const password = data.password;

        try {
            await baseApi.post(`/api/users/external`, data);

            const response: AxiosResponse = await baseApi.post(
                `/api/auth/login`,
                { email, password, remember: true }
            );

            if (response.status === 200) {
                if (response.data.data.token && typeof response.data.data.token === 'string') {
                    signIn(response.data.data.token)
                    logged();
                    getUserData();
                    navigate('/');
                }
            }
        }
        catch (error) {
            setTextMessage('Ocorreu um erro ao salvar o usuário!');
            setTypeMessage('error');
            setOpenMessage(true);
        } finally {
            setLoading(false);
        }
    }

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            onSubmit(methods.getValues());
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const handleClose = () => {
        setOpenMessage(false);
    }

    return (
        <FormProvider {...methods}>
            <Grid container justifyContent='center' sx={{
                marginTop: '2rem',
            }}>
                <Grid item xs={12}>
                    <Stepper alternativeLabel activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconProps={{
                                    sx: {
                                        color: 'secondary.main',
                                        '& .MuiStepIcon-text': {
                                            fill: theme.palette.common.white,
                                        },
                                        '&.Mui-active': {
                                            color: theme.palette.secondary.main + ' !important',
                                        },
                                        '&.Mui-completed': {
                                            color: theme.palette.secondary.main + ' !important',
                                        }
                                    }
                                }}
                                >
                                    <Typography sx={{ color: 'secondary.main' }}>

                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

                <Grid item xs={10} sm={8} md={6} lg={4} marginY={2} >
                    <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px' }}>
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    startIcon={<KeyboardBackspace color="inherit" />}
                                    sx={{ mr: 1 }}
                                >
                                    <Typography color='inherit'>
                                        Voltar
                                    </Typography>
                                </Button>
                                <Button color='secondary' type="submit" variant="contained" startIcon={<ChevronRight color="primary" />}>
                                    <Typography color='primary'>
                                        {activeStep === steps.length - 1 ? 'Criar conta' : 'Próximo'}
                                    </Typography>
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
            <Message message={textMessage} onClose={handleClose} type={typeMessage} open={openMessage} />
        </FormProvider>
    )
}
