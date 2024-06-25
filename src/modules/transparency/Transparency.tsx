import { Hardware, Margin, Savings } from "@mui/icons-material"
import { Box, Container, Grid, Paper, Typography } from "@mui/material"
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner"


export const Transparency = () => {
    const stylePrincipalTitle = {
        fontSize: { xs: '1.5rem', lg: '2rem' },
        fontWeight: 'bold',
        margin: '0',
        marginBottom: '0.5rem'
    }
    const stylePrincipalSubTitle = {        
        fontSize: '1.2rem',
        fontWeight: '500',
        margin: '0'
    }
    const styleTitle = {        
        fontSize: {xs: ''},
        fontWeight: 'bold',
        margin: '0'
    }

    const styleBody = {
        fontSize: '1.5rem',
        fontWeight: '800',
        margin: '0'
    }


    const styleIcon = {
        opacity: '0.4',
        fontSize: '1.5rem'
    }

    const styleBox = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '1rem',
    }

    const stylePaper = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '1.2rem',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E0E0E0',
        backgroundColor: 'white',
    }
    return (
        <>
            <HeaderBanner />
            <Container maxWidth="xl">
                <Grid container xs={12} spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h1" color="secondary.main" sx={stylePrincipalTitle}>
                            Transparência
                        </Typography>
                        <Typography variant="body1" color="grey.500" sx={stylePrincipalSubTitle}>
                            Valores de entradas e saídas do mês de Julho/2024
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={styleBox}>
                                <Savings color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Total de Entradas
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                R$ 56.214,44
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={styleBox}>
                                <Hardware color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Total de Saídas
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                R$ 9.876,98
                            </Typography>
                        </Paper>
                    </Grid>


                </Grid>
            </Container>
        </>
    )
}