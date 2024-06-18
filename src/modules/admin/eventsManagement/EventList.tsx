import { AddCircleOutlineOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { grey } from '@mui/material/colors';
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseApi } from '../../../lib/api';
import { Event } from './types';


function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/events`);
      const events = response.data.data;
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function formatDate(date: string, usToBr: boolean = false) {
    let splitted;
    if (usToBr) {
      splitted = date.split('-')
      return splitted.reverse().join('/');
    }
    splitted = date.split('/');
    return splitted.reverse().join('-');
  }

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          {
            events.length <= 1 &&
            <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} color={grey[500]}>Evento</Typography>
          }
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'}>Listando {events.length} eventos</Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='success' component={Link} to="new" endIcon={<AddCircleOutlineOutlined fontSize="inherit" />}>
            <Typography fontSize="inherit" marginBottom={'0'}>Novo</Typography>
          </Button>
        </Grid>
      </Grid>

      {isLoading ?
        <p>Carregando...</p>
        :
        <TableContainer component={Paper} sx={{ border: '1px solid #d6d6d6' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    {event.name}
                  </TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{formatDate(event.event_date, true)}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`${event.id}`}><EditIcon color="warning" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </Container>

  )
}

export default EventList;