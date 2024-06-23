import { AddCircleOutlineOutlined, Close, Search } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Button,
  Container,
  Grid,
  IconButton,
  OutlinedInput,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseApi } from '../../../lib/api';
import FullLoader from '../../../shared/components/loading/FullLoader';
import useAuthStore from '../../../shared/store/authStore';
import { Paginate } from '../../../shared/types';
import { User, UserStatus } from './types';

function UserList() {
  const imageUrl = import.meta.env.VITE_URL_IMAGE;
  const navigate = useNavigate();

  const isTokenRefreshed = useRef(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setToken } = useAuthStore(state => ({
    user: state.userData,
    setToken: state.setToken
  }));
  const [paginate, setPaginate] = useState<Paginate>();
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/users/?search=${search}&page=${page}`);
      const users = response.data.data;
      setPaginate(response.data);
      setUsers(users);
    } catch (error: any) {
      if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
        console.log("Refreshing token...");
        try {
          isTokenRefreshed.current = true;
          const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
          const refreshToken = responseRefreshToken.data.newToken;
          setToken(refreshToken);
          fetchUsers(page);
        } catch (error) {
          navigate('/login');
        }
      } else {
        console.error("Failed to fetch users:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, setToken, navigate, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const disableUser = async (id: number) => {
    await baseApi.patch(`/api/users/${id}/disable`, null);
  };

  const enableUser = async (id: number) => {
    await baseApi.patch(`/api/users/${id}/enable`, null);
  };

  const changeStatus = async (id: number) => {
    try {
      const user = users.find(user => user.id === id);
      if (user?.status === UserStatus.ENABLED) {
        await disableUser(id);
      } else {
        await enableUser(id);
      }
      fetchUsers(paginate?.current_page);
    } catch (error) {
      console.error("Failed to change user status:", error);
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handlePageChange = (_, value) => {
    fetchUsers(value);
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, paddingBottom: 4 }} >
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} >
            Listando <strong>{(paginate?.to ?? 0) - (paginate?.from ?? 0) + (paginate?.total === 0 ? 0 : 1)} usuários</strong> de <strong>{paginate?.total}</strong> no total
          </Typography>
        </Grid>
        <Grid item display='flex'>
          <OutlinedInput
            placeholder='Pesquisar nome'
            color='secondary'
            value={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onChange={(e) => setSearch(e.target.value)}
            size='small'
            endAdornment={
              !search ? (
                <IconButton
                  aria-label="search"
                  edge="end"
                  onClick={handleSearch}
                >
                  <Search />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="clear"
                  edge="end"
                  onClick={() => setSearch('')}
                >
                  <Close />
                </IconButton>
              )
            }
            sx={{
              marginRight: 1,
              borderRadius: '10px',
            }}
          />
          <Button
            variant='contained'
            color='success'
            component={Link}
            to="new"
            endIcon={<AddCircleOutlineOutlined fontSize="inherit" />}
            sx={{
              padding: '10px',
              borderRadius: '10px',
            }}
          >
            <Typography fontSize="inherit" marginBottom={'0'} sx={{ textTransform: 'none' }}>Novo</Typography>
          </Button>
        </Grid>
      </Grid>

      {isLoading ? (
        <FullLoader />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                  <TableCell sx={{ fontWeight: '600' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>E-mail</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Nível</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} sx={{ filter: user.status === UserStatus.DISABLED ? 'grayscale(1)' : 'none' }}>
                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Avatar
                        sx={{ width: '32px', height: '32px' }}
                        alt={user.person.name}
                        {...(user.person.profile_picture != null ? { src: `${imageUrl + user.person.profile_picture.filename_id}` } : {})}
                      />
                      {user.person.name}
                    </TableCell>
                    <TableCell>{user.person.email}</TableCell>
                    <TableCell>{user.role.name}</TableCell>
                    <TableCell>
                      <IconButton size='small' component={Link} to={`${user.id}`}><EditIcon color="warning" /></IconButton>
                      <Button color='error' onClick={() => changeStatus(user.id)} sx={{ marginLeft: 2 }}>
                        <Typography sx={{ fontSize: '12px' }}>
                          {user.status === UserStatus.ENABLED ? 'Desativar' : 'Ativar'}
                        </Typography>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack spacing={2} sx={{ marginTop: 2 }} alignItems="left">
            <Pagination
              count={paginate?.last_page}
              page={paginate?.current_page}
              onChange={handlePageChange}
              variant="outlined"
              color="secondary"
              shape="rounded"
            />
          </Stack>
        </>
      )}
    </Container>
  );
}

export default UserList;
