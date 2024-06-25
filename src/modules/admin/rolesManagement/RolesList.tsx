import { AddCircleOutlineOutlined, Close, Search } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
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

interface Role {
  id: number;
  name: string;
}

function RolesList() {
  const navigate = useNavigate();
  const isTokenRefreshed = useRef(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paginate, setPaginate] = useState<Paginate>();
  const { user, setToken } = useAuthStore(state => ({
    user: state.userData,
    setToken: state.setToken
  }));

  const fetchRoles = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/roles/?search=${search}&page=${page}`);
      setRoles(response.data.data);
      setPaginate(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
        console.log("Refreshing token...");
        try {
          isTokenRefreshed.current = true;
          const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
          const refreshToken = responseRefreshToken.data.newToken;
          setToken(refreshToken);
          fetchRoles(page);
        } catch (error) {
          navigate('/login');
        }
      } else {
        console.error("Failed to fetch users:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [search, navigate]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSearch = () => {
    fetchRoles();
  };

  const handlePageChange = (_, value) => {
    fetchRoles(value);
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, paddingBottom: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'}>
            Listando <strong>{(paginate?.to ?? 0) - (paginate?.from ?? 0) + (paginate?.total === 0 ? 0 : 1)} cargos</strong> de <strong>{paginate?.total}</strong> no total
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
                <IconButton aria-label="search" edge="end" onClick={handleSearch}>
                  <Search />
                </IconButton>
              ) : (
                <IconButton aria-label="clear" edge="end" onClick={() => setSearch('')}>
                  <Close />
                </IconButton>
              )
            }
            sx={{ marginRight: 1, borderRadius: '10px' }}
          />
          <Button
            variant='contained'
            color='success'
            component={Link}
            to="new"
            endIcon={<AddCircleOutlineOutlined fontSize="inherit" />}
            sx={{ padding: '10px', borderRadius: '10px' }}
          >
            <Typography fontSize="inherit" marginBottom={'0'} sx={{ textTransform: 'none' }}>Novo</Typography>
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <FullLoader />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                  <TableCell sx={{ fontWeight: '600' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Nome</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Ações</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
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

export default RolesList;
