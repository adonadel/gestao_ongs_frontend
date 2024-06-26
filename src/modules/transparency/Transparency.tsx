import {Favorite, FavoriteBorderOutlined, Hardware, MedicalInformation, Savings, Support} from "@mui/icons-material"
import {Box, CircularProgress, Container, Divider, Grid, Paper, Typography} from "@mui/material"
import {HeaderBanner} from "../../shared/headerBanner/HeaderBanner"
import './style.css'
import {CardAdoption} from "../../shared/components/card/CardAdoption"
import {CardDonate} from "../../shared/components/card/CardDonate"
import {useEffect, useState} from "react";
import {baseApi} from "../../lib/api.ts";


export const Transparency = () => {
      const [isLoading, setIsLoading] = useState(true);
      const [totalFinances, setTotalFinances] = useState(null);
      const [totalAnimals, setTotalAnimals] = useState(null);
      const [totalAnimalsCastration, setTotalAnimalsCastration] = useState(null);
      
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
    
    const months = [
      "Janeiro", 
      "Fevereiro", 
      "Março", 
      "Abril", 
      "Maio", 
      "Junho",
      "Julho", 
      "Agosto", 
      "Setembro", 
      "Outubro", 
      "Novembro", 
      "Dezembro"
    ];
    
    const today = new Date();
    
    const actualMonth = months[today.getMonth()];
    
    const actualYear = today.getFullYear();
    
      const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
          const financeResponse = await baseApi.get(`/api/dashboards/finances-external`);
          const animalsResponse = await baseApi.get(`/api/dashboards/animals`);
          const castrationResponse = await baseApi.get(`/api/dashboards/animals/castration`);
          setTotalFinances(financeResponse.data);
          setTotalAnimals(animalsResponse.data);
          setTotalAnimalsCastration(castrationResponse.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
        setIsLoading(false);
      };
      
      function formatMoney(value:number)
      {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      }
      
      useEffect(() => {
        fetchDashboardData();
      }, []);

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
                            Valores de entradas e saídas do mês de {actualMonth} e do ano de {actualYear}
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
                                    {actualMonth}
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
                                {
                                    isLoading ?
                                        <CircularProgress color='secondary' size={'1.5rem'}/> : 
                                        totalFinances? formatMoney(parseFloat(totalFinances?.monthIncome)) : 0
                                }
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
                                    {actualMonth}
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
                                {
                                    isLoading ?
                                        <CircularProgress color='secondary' size={'1.5rem'}/> : 
                                        totalFinances? formatMoney(parseFloat(totalFinances?.monthExpense)) : 0
                                }
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
                                    {actualYear}
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
                                {
                                    isLoading ?
                                        <CircularProgress color='secondary' size={'1.5rem'}/> : 
                                        totalFinances? formatMoney(parseFloat(totalFinances?.yearIncome)) : 0
                                }
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
                                    {actualYear}
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
                                {
                                    isLoading ?
                                        <CircularProgress color='secondary' size={'1.5rem'}/> : 
                                        totalFinances? formatMoney(parseFloat(totalFinances?.yearExpense)) : 0
                                }
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
                                Já foram mais de <strong style={{ fontSize: '1.2rem', color: '#15B6B1' }}>{ isLoading ? <CircularProgress color='secondary' size={'1.3rem'}/> : totalAnimals ? totalAnimals?.total : 0}</strong> <span style={{ color: '#15B6B1' }}>animais</span> resgatados!
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
                                {
                                    isLoading ?
                                      <CircularProgress color='secondary' size={'1.05rem'}/> :
                                      totalAnimals ? totalAnimals?.total : 0
                                }
                                <span style={{
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
                                {
                                    isLoading ?
                                      <CircularProgress color='secondary' size={'1.05rem'}/> :
                                      totalAnimals ? totalAnimals?.totalAdopted : 0
                                }
                                <span style={{
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
                                {
                                    isLoading ?
                                      <CircularProgress color='secondary' size={'1.05rem'}/> :
                                      totalAnimalsCastration ? totalAnimalsCastration?.totalCastrated : 0
                                }
                                <span style={{
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
                                {
                                    isLoading ?
                                      <CircularProgress color='secondary' size={'1.05rem'}/> :
                                      totalAnimals ? totalAnimals?.totalNotAdopted : 0
                                }
                                <span style={{
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