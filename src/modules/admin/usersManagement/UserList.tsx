import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
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
import {AxiosResponse} from "axios";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {User, UserStatus} from './types';
import {AddCircleOutlineOutlined} from '@mui/icons-material';
import {grey} from '@mui/material/colors';
import baseApi from '../../../lib/api';


function UserList() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_URL_IMAGE;
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/users`);
      const users = response.data.data;
      setUsers(users);
      console.log(users);
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
     <Container maxWidth="xl">
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item> 
          {
            users.length <= 1 &&
            <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} color={grey[500]}>Usuário</Typography>
          }
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'}>Listando {users.length} usuários</Typography>
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
        <TableContainer component={Paper} sx={{border: '1px solid #d6d6d6'}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>                
                <TableCell>Nome</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Nível</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}
                  sx={{
                    filter: user.status === UserStatus.DISABLED ? 'grayscale(1)' : 'none'
                  }}
                >
                  <TableCell sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <Avatar
                      sx={{ width: '32px', height: '32px' }}
                      alt={user.person.name}
                      {
                      ...(user.person.profile_picture != null ? { src: `${imageUrl + user.person.profile_picture.filename_id}` } : {})
                      }
                    />
                    {user.person.name}
                  </TableCell>
                  <TableCell>{user.person.email}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
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