import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Person {
  id: number;
  name: string;
  email: string;
}

interface Role {
  name: string;
}

enum UserStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'

}

interface User {
  id: number;
  role_id: number;
  people_id: number;
  created_at: string;
  person: Person;
  role: Role;
  status: UserStatus;
}

interface PaginatedUserResponse {
  data: User[];
}

function UserList() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response: AxiosResponse<PaginatedUserResponse> = await axios.get<PaginatedUserResponse>(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
      navigate('/login')
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const disableUser = async (id: number, token: string) => {
    await axios.patch(`${apiUrl}/api/users/${id}/disable`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const enableUser = async (id: number, token: string) => {
    await axios.patch(`${apiUrl}/api/users/${id}/enable`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const changeStatus = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const user = users.find(user => user.id === id);
    if (!user) {
      return;
    }
    if (user.status === UserStatus.ENABLED) {
      await disableUser(id, token);
    } else {
      await enableUser(id, token);
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

      {loading ?
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