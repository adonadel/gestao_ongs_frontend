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
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseApi } from '../../../lib/api';

interface Role {
  id: number;
  name: string;
}

interface PaginatedRolesResponse {
  data: Role[];
}

function RolesList() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      const response: AxiosResponse<PaginatedRolesResponse> = await baseApi.get<PaginatedRolesResponse>('/api/roles');
      setRoles(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setLoading(false);
      navigate('/login')
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ paddingY: '10px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3">Cargos</Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' component={Link} to="new">
            <Typography>Adicionar Cargo</Typography>
          </Button>
        </Grid>

      </Grid>

      {loading ?
        <p>Carregando...</p>
        :
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} >
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`${role.id}`}><EditIcon color="warning" /></IconButton>
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

export default RolesList;