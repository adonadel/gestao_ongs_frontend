import { ChevronRight } from "@mui/icons-material";
import { Box, Button, Container, Grid, Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { StepConfirm } from "./steps/StepConfirm";
import { StepResponse } from "./steps/StepResponse";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../shared/store/authStore";
import { baseApi } from "../../lib/api";
import { Message } from "../../shared/components/message/Message";

const steps = [
    'Confirmação',
    'Próximos passos',
];

export const Adoption = () => {
    const { id } = useParams<{ id: string }>();
    const theme = useTheme();
    const navigate = useNavigate();
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));

    const handleClose = () => {
        setOpenMessage(false);
    }
    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);

    const [activeStep, setActiveStep] = useState(0);

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <StepConfirm />;
            case 1:
                return <StepResponse />;
            default:
                throw new Error('Unknown step');
        }
    }

    useEffect(() => {
        if (!userData) {
            setTextMessage('Você precisa estar logado para acessar essa página!');
            setTypeMessage('error');
            setOpenMessage(true);

            setTimeout(() => {
                navigate('/login');
            }, 10000);
        }
    }, [userData, navigate]);

    const postAdoption = async () => {
        try {
            const response = baseApi.post(`/api/adoptions`, {
                user_id: userData?.id,
                animal_id: id,
            });

            if ((await response).status !== 201) {
                throw new Error('Ocorreu um erro ao enviar a solicitação de adoção!');                                
            }

            setTextMessage('Solicitação enviada!');
            setTypeMessage('success');
            setOpenMessage(true);
        } catch (e) {            

            setTextMessage('Ocorreu um erro ao enviar a solicitação de adoção!');            
            setTypeMessage('error');
            setOpenMessage(true);    
            
            setTimeout(() => {
                navigate('/');
            }, 3000);        
        }
    }

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            navigate('/');
        } else {
            setActiveStep((prev) => prev + 1);
            postAdoption();
        }
    };

    return (
        <Container>
            <Grid container justifyContent='center' mt={6}>
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
                                    <Typography sx={{ color: 'grey.500', fontSize: "0.8rem" }}>
                                        {label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>

                <Grid item xs={12} sm={10} md={6} lg={6} mt={4} >

                    {getStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={handleNext} color='secondary' variant="contained" startIcon={activeStep === steps.length - 1 ? "" : <ChevronRight color="primary" />} sx={{
                            borderRadius: '2rem',
                            padding: '0.5rem 1rem',
                        }}>
                            <Typography color='primary'>
                                {activeStep === steps.length - 1 ? 'Ok entendi' : 'Confirmar'}
                            </Typography>
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Message
                message={textMessage}
                type={typeMessage}
                open={openMessage}
                onClose={handleClose}
            />
        </Container>
    );
};