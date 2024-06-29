import { Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { baseApi } from "../../../lib/api.ts";
import LineChart from "../../../shared/components/charts/LineChart.tsx";
import { Loading } from "../../../shared/components/loading/Loading.tsx";


function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalFinances, setTotalFinances] = useState(null);
  const [totalAnimals, setTotalAnimals] = useState(null);
  const [totalAnimalsCastration, setTotalAnimalsCastration] = useState(null);
  const [dashboardType, setDashboardType] = useState('yearly');
  const [seriesData, setSeriesData] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setSeriesData(null);
    try {
      const financeResponse = await baseApi.get(`/api/dashboards/finances?type=${dashboardType}`);
      const animalsResponse = await baseApi.get(`/api/dashboards/animals?type=${dashboardType}`);
      const castrationResponse = await baseApi.get(`/api/dashboards/animals/castration?type=${dashboardType}`);
      setTotalFinances(financeResponse.data);
      setTotalAnimals(animalsResponse.data);
      setTotalAnimalsCastration(castrationResponse.data);
      setSeriesData(financeResponse.data.chart);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setIsLoading(false);
  };

  function formatMoney(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  useEffect(() => {
    fetchDashboardData();
  }, [dashboardType]);

  return (
    <Container maxWidth="xl" style={{ marginTop: '4rem' }}>
      {isLoading ?
        <p>Carregando...</p>
        :
        <>
          <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
            <Grid item>
              <Typography variant="h3" fontSize={'1.5rem'} fontWeight={700}  marginBottom={'1rem'}>Relação de entradas e saídas</Typography>
            </Grid>
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="especie-label">Período</InputLabel>
                <Select
                  label="Período"
                  labelId="type-label"
                  id="type"
                  value={dashboardType}
                  onChange={(e) => { setDashboardType(e.target.value as string); }}
                >
                  <MenuItem value="yearly" selected>Ano corrente</MenuItem>
                  <MenuItem value="monthly">Mês corrente</MenuItem>
                  <MenuItem value="weekly">Semana corrente</MenuItem>
                  <MenuItem value="all">Período completo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            {(isLoading && seriesData) ? (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Loading />
              </Grid>
            ) : (
              seriesData[0].data.length !== 0 && (
                <Grid item xs={12}>
                  <LineChart
                    footerType={dashboardType}
                    seriesData={seriesData}
                    chartTitle='Relação de entradas e saídas' />
                </Grid>
              )
            )}
          </Grid>

          <Grid container spacing={2}>
            <Grid item style={{ marginTop: '4rem' }} xs={12}>
              <Typography variant="h3" fontSize={'1.5rem'} fontWeight={700} marginBottom={'1rem'}>Financeiro</Typography>
            </Grid>
            <Grid item>
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography variant="h3" fontSize={'1rem'} fontWeight={'bold'} marginBottom={'1rem'} color={'#15B6B1'}>
                  Caixa atual
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} color={'#15B6B1'}>
                  {formatMoney(parseFloat(totalFinances?.total))}
                </Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }}>
                <Typography variant="h3" fontSize={'1rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                  Total arrecadado
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {formatMoney(parseFloat(totalFinances?.totalIncome))}
                </Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }}>
                <Typography variant="h3" fontSize={'1rem'} fontWeight={'bold'} marginBottom={'1rem'}>
                  Total gasto
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {formatMoney(parseFloat(totalFinances?.totalExpense))}
                </Typography>
              </Paper>
            </Grid>
            <Grid item style={{ marginTop: '4rem' }} xs={12}>
              <Typography variant="h3" fontSize={'1.5rem'} fontWeight={700}  marginBottom={'1rem'}>Relação de animais</Typography>
            </Grid>
            <Grid item >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  color={'#15B6B1'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Animais resgatados
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'} color={'#15B6B1'}>
                  {totalAnimals?.total}
                </Typography>
              </Paper>
            </Grid>

            <Grid item  >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Adotados
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {totalAnimals?.totalAdopted}
                </Typography>
              </Paper>
            </Grid>

            <Grid item  >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Não adotados
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {totalAnimals?.totalNotAdopted}
                </Typography>
              </Paper>
            </Grid>

            <Grid item  >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Animais castrados
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {totalAnimalsCastration?.totalCastrated}
                </Typography>
              </Paper>
            </Grid>

            <Grid item  >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Não castrados
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {totalAnimalsCastration?.totalNotCastrated}
                </Typography>
              </Paper>
            </Grid>

            <Grid item  >
              <Paper elevation={3} sx={{ padding: 4, borderRadius: '12px',width: '200px' }} >
                <Typography
                  variant="h3"
                  fontSize={'1rem'}
                  fontWeight={'bold'}
                  marginBottom={'1rem'}
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Aguardando castração
                </Typography>
                <Typography variant="h3" fontSize={'1.3rem'} fontWeight={'bold'}>
                  {totalAnimalsCastration?.totalAwaitingCastration}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      }
    </Container >
  )
}

export default Dashboard;