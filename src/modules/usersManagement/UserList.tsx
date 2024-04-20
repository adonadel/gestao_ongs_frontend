import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Typography, Container } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Person {
  id: number;
  name: string;
  email: string;
}

interface Role {
  name: string;
}

interface User {
  id: number;
  role_id: number;
  people_id: number;
  created_at: string;
  person: Person;
  role: Role;
}

interface PaginatedUserResponse {
  data: User[];
}

function UserList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response: AxiosResponse<PaginatedUserResponse> = await axios.get<PaginatedUserResponse>('http://localhost/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
        navigate('/')
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography variant="h3">Usuários</Typography>
      </Box>

      {loading ?
        <p>Carregando...</p>
        :
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell>Email</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.role.name}</TableCell>
                  <TableCell>{row.person.email}</TableCell>
                  <TableCell>
                    <IconButton><EditIcon color="warning" /></IconButton>
                    <IconButton><DeleteIcon color="error" /></IconButton>
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
