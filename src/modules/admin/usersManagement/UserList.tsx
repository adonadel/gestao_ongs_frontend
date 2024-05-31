import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Button, Container, Grid, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from '../../../shared/reducers/userReducer';
import { getToken } from '../../../shared/utils/getToken';
import { PaginatedUserResponse, User, UserStatus } from './types';
import { ClearIcon } from '@mui/x-date-pickers';
import { AddCircleOutlineOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';




function UserList() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const imageUrl = import.meta.env.VITE_URL_IMAGE;
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const logout = useUserStore(state => state.logout);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = getToken();

      const response: AxiosResponse<PaginatedUserResponse> = await axios.get<PaginatedUserResponse>(`${apiUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

  const disableUser = async (id: number, token: string | void) => {
    await axios.patch(`${apiUrl}/api/users/${id}/disable`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const enableUser = async (id: number, token: string | void) => {
    await axios.patch(`${apiUrl}/api/users/${id}/enable`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const changeStatus = async (id: number) => {
    try {
      const token = getToken();
      const user = users.find(user => user.id === id);
      if (user?.status === UserStatus.ENABLED) {
        await disableUser(id, token);
      } else {
        await enableUser(id, token);
      }
    } catch (error) {
      logout();
    }
    fetchUsers();
  }

  return (
     <Grid>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'bold'}>Usuários</Typography>
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
      </Grid>

  )
}

export default UserList;