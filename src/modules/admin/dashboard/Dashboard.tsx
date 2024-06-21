import {Box, Container, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import LineChart from "../../../shared/components/charts/LineChart.tsx";
import {AxiosResponse} from "axios";
import {baseApi} from "../../../lib/api.ts";


function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [totalFinances, setTotalFinances] = useState(null);
  const [totalAnimals, setTotalAnimals] = useState(null);
  const [totalAnimalsCastration, setTotalAnimalsCastration] = useState(null);
  

  const fetchTotalFinance = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/dashboards/finances`);
      const totalFinancess = response.data;
      setTotalFinances(totalFinancess);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setIsLoading(false);
  };
  
  const fetchTotalAnimals = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/dashboards/animals`);
      const totalAnimals = response.data;
      setTotalAnimals(totalAnimals);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setIsLoading(false);
  };
  
  const fetchTotalAnimalsCastration = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/dashboards/animals/castration`);
      const totalAnimalsCastration = response.data;
      setTotalAnimalsCastration(totalAnimalsCastration);
    } catch (error) {
      console.error('Error fetching events:', error);
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
    fetchTotalFinance();
    fetchTotalAnimals();
    fetchTotalAnimalsCastration();
  }, []);

  return (
    <Container maxWidth="xl" style={{marginTop: '4rem'}}>
      {isLoading ?
        <p>Carregando...</p>
        :
          <Grid>
            <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} marginBottom={'1rem'}>Relação de entradas e saídas</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <LineChart/>
              </Grid>
              <Grid item xs={4} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'} color={'#15B6B1'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} color={'#15B6B1'}>
                    {
                      formatMoney(parseFloat(totalFinances?.total))
                    }
                  </Typography>
                  <Typography variant="caption">
                    Caixa atual
                  </Typography>                  
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      formatMoney(parseFloat(totalFinances?.totalIncome))
                    }
                  </Typography>
                  <Typography variant="caption">
                    Total arrecadado
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      formatMoney(parseFloat(totalFinances?.totalExpense))
                    }
                  </Typography>
                  <Typography variant="caption">
                    Total gasto
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'} color={'#15B6B1'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} color={'#15B6B1'}>
                    {
                      totalAnimals?.total
                    }
                  </Typography>
                  <Typography variant="caption">
                    Animais resgatados
                  </Typography>                  
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      totalAnimals?.totalAdopted
                    }
                  </Typography>
                  <Typography variant="caption">
                    Adotados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      totalAnimals?.totalNotAdopted
                    }
                  </Typography>
                  <Typography variant="caption">
                    Não adotados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      totalAnimalsCastration?.totalCastrated
                    }
                  </Typography>
                  <Typography variant="caption">
                    Animais castrados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      totalAnimalsCastration?.totalNotCastrated
                    }
                  </Typography>
                  <Typography variant="caption">
                    Não castrados
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Box sx={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #E0E0E0',
                        backgroundColor: 'white',
                    }
        
                }>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                    {
                      new Date().getFullYear()
                    }
                  </Typography>
                  <Typography  variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                    {
                      totalAnimalsCastration?.totalAwaitingCastration
                    }
                  </Typography>
                  <Typography variant="caption">
                    Aguardando castração
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
      }
    </Container>
  )
}

export default Dashboard;