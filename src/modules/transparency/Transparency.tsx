import { Favorite, FavoriteBorderOutlined, Hardware, MedicalInformation, Savings, Support } from "@mui/icons-material"
import { Box, Container, Divider, Grid, Paper, Typography } from "@mui/material"
import { HeaderBanner } from "../../shared/headerBanner/HeaderBanner"
import './style.css'
import { CardAdoption } from "../../shared/components/card/CardAdoption"
import { CardDonate } from "../../shared/components/card/CardDonate"


export const Transparency = () => {
    const stylePrincipalTitle = {
        fontSize: { xs: '1.2rem', lg: '1.5rem' },
        fontWeight: 'bold',
        margin: '0',
        marginBottom: '0.5rem'
    }
    const stylePrincipalSubTitle = {
        fontSize: '1rem',
        fontWeight: '500',
        margin: '0'
    }
    const styleTitle = {
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        margin: '0'
    }

    const styleBody = {
        fontSize: '1.2rem',
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
            <Container maxWidth="lg">
                <Grid container xs={12} spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h1" color="secondary.main" sx={stylePrincipalTitle}>
                            Transparência
                        </Typography>
                        <Typography variant="body1" color="grey.500" sx={stylePrincipalSubTitle}>
                            Valores de entradas e saídas do mês de Julho e do ano de 2024
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Julho
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
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

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Julho
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
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
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    2024
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
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

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    2024
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
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

                <Grid container xs={12}>
                    <Divider sx={{ width: '100%', margin: '1rem 0' }} />
                </Grid>

                <Grid container xs={12} mt={8}>
                    <Grid item xs={12} md={7} lg={5}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            borderRadius: '1rem',
                            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                            border: '1px solid #E0E0E0',
                        }}>
                            <img className="imageAnnouncement" src="/highfivedogindicator.png" alt="Cachorro com a pata levantada" style={{
                                marginBottom: '-1rem'
                            }} />
                            <Typography variant="body1" color="grey.500" sx={{
                                fontSize: { xs: '1rem', lg: '1.2rem' },
                                fontWeight: '400',
                                margin: '0',
                            }}>
                                Já foram mais de <strong style={{ fontSize: '1.2rem', color: '#15B6B1' }}>5.593</strong> <span style={{ color: '#15B6B1' }}>animais</span> resgatados!
                            </Typography>
                        </Box>

                    </Grid>
                </Grid>

                <Grid container xs={12} mt={8}>
                    <Divider sx={{ width: '100%', margin: '1rem 0' }} />
                </Grid>

                <Grid container xs={12} spacing={2}>

                    <Grid item xs={12}>
                        <Typography variant="h1" color="secondary.main" sx={stylePrincipalTitle}>
                            Indicadores pet
                        </Typography>
                        <Typography variant="body1" color="grey.500" sx={stylePrincipalSubTitle}>
                            Entenda o impacto do seu apoio
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Todo o tempo
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
                            <Box sx={styleBox}>
                                <Support color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Resgatados
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                5.593 <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem',
                                    color: '#15B6B1'
                                }}>pets</span>
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Todo o tempo
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
                            <Box sx={styleBox}>
                                <Favorite color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Adotados
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                2.319 <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem',
                                    color: '#15B6B1'
                                }}>pets</span>
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Todo o tempo
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
                            <Box sx={styleBox}>
                                <MedicalInformation color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Castrados
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                4.125 <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem',
                                    color: '#15B6B1'
                                }}>pets</span>
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={stylePaper}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: '-1rem',
                                gap: '0.5rem'
                            }}>

                                <Typography variant="body1" color="grey.400" sx={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    margin: '0'
                                }}>
                                    Todo o tempo
                                </Typography>
                                <Divider sx={{ width: '100%' }} />
                            </Box>
                            <Box sx={styleBox}>
                                <FavoriteBorderOutlined color="secondary" sx={styleIcon} />
                                <Typography variant="h3" color="secondary.light" sx={styleTitle}>
                                    Disponíveis para adoção
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="secondary.dark" sx={styleBody}>
                                1.245 <span style={{
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    marginLeft: '0.5rem',
                                    color: '#15B6B1'
                                }}>pets</span>
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container xs={12} mt={8}>
                    <Grid item xs={12}>
                        <Typography variant="h1" color="secondary.main" sx={stylePrincipalTitle}>
                            Ajude a melhorar esses números
                        </Typography>
                        <Typography variant="body1" color="grey.500" sx={stylePrincipalSubTitle}>
                            Adote, doe, compartilhe
                        </Typography>
                    </Grid>

                    <Grid container spacing={4} alignItems={'strech'} mt={0}>
                        <Grid item xs={12} sm={6} md={5}>
                            <CardAdoption />
                        </Grid>

                        <Grid item xs={12} sm={6} md={5}>
                            <CardDonate />
                        </Grid>
                    </Grid>
                </Grid>


            </Container>
        </>
    )
}