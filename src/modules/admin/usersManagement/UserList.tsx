import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import baseApi from '../../../lib/api';
import { User, UserStatus } from './types';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/users`);
      const users = response.data.data;
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const disableUser = async (id: number) => {
    await baseApi.patch(`/api/users/${id}/disable`, null);
  }

  const enableUser = async (id: number) => {
    await baseApi.patch(`/api/users/${id}/enable`, null);
  }

  const changeStatus = async (id: number) => {
    try {
      const user = users.find(user => user.id === id);
      if (user?.status === UserStatus.ENABLED) {
        await disableUser(id);
      } else {
        await enableUser(id);
      }
    } catch (error) {
      // logout();
    }
    fetchUsers();
  }

  return (
    <Container maxWidth="lg" sx={{ paddingY: '10px' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3">Usuários</Typography>
        </Grid>
        <Grid item>
          <Button variant='contained' color='primary' component={Link} to="new">
            <Typography>Adicionar Usuário</Typography>
          </Button>
        </Grid>

      </Grid>

      {isLoading ?
        <p>Carregando...</p>
        :
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}
                  sx={{
                    filter: user.status === UserStatus.DISABLED ? 'grayscale(1)' : 'none'
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.person.name}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
                  <TableCell>{user.person.email}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`${user.id}`}><EditIcon color="warning" /></IconButton>
                    <IconButton onClick={() => changeStatus(user.id)}><DeleteIcon color="error" /></IconButton>
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

export default UserList;