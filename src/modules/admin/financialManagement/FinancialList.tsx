import { AddCircleOutlineOutlined, ArrowDownward, ArrowUpward, AttachMoney, Close, Search } from '@mui/icons-material';
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
import useAuthStore from "../../../shared/store/authStore";
import { Paginate } from "../../../shared/types";
import { Financial } from "./types";

const IncomeIcon = () => {
  return (
    <span style={{ display: "flex", justifyContent: "Center", alignItems: "Center", marginLeft: "5px" }}>
      <AttachMoney style={{ color: '#4caf50' }} />
      <ArrowUpward style={{ marginLeft: '-5px', color: '#4caf50' }} />
    </span>
  );
}

const ExpenseIcon = () => {
  return (
    <span style={{ display: "flex", justifyContent: "Center", alignItems: "Center" }}>
      <AttachMoney style={{ color: '#f44336' }} />
      <ArrowDownward style={{ marginLeft: '-5px', color: '#f44336' }} />
    </span>
  );
}

function FinancialList() {
  const navigate = useNavigate();

  const [finances, setFinancials] = useState<Financial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginate, setPaginate] = useState<Paginate>();
  const [search, setSearch] = useState('');
  const isTokenRefreshed = useRef(false);
  const { user, setToken } = useAuthStore(state => ({
    user: state.userData,
    setToken: state.setToken
  }));

  const fetchFinancials = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/finances/?search=${search}&page=${page}`);
      const finances = response.data.data;
      setFinancials(finances);
      setPaginate(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
        console.log("Refreshing token...");
        try {
          isTokenRefreshed.current = true;
          const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
          const refreshToken = responseRefreshToken.data.newToken;
          setToken(refreshToken);
          fetchFinancials(page);
        } catch (error) {
          navigate('/login');
        }
      } else {
        console.error("Failed to fetch users:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, navigate]);

  useEffect(() => {
    fetchFinancials();
  }, [fetchFinancials]);

  function formatDate(date: string, usToBr: boolean = false) {
    let splitted;
    if (usToBr) {
      splitted = date.split('-')
      return splitted.reverse().join('/');
    }
    splitted = date.split('/');
    return splitted.reverse().join('-');
  }

  function formatMoney(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  const handleSearch = () => {
    fetchFinancials();
  };

  const handlePageChange = (_, value) => {
    fetchFinancials(value);
  };

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, paddingBottom: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} >
            Listando <strong>{(paginate?.to ?? 0) - (paginate?.from ?? 0) + (paginate?.total === 0 ? 0 : 1)} finanças</strong> de <strong>{paginate?.total}</strong> no total
          </Typography>
        </Grid>
        <Grid item display='flex'>
          <OutlinedInput
            placeholder='Pesquisar descrição'
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

      {isLoading ?
        <FullLoader />
        :
        <>
          <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                  <TableCell width='10px' align='center' sx={{ fontWeight: '600' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Valor</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Descrição</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Data</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finances.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell width='10px'>
                      {finance.type === 'INCOME' ?
                        <IncomeIcon /> :
                        <ExpenseIcon />}
                    </TableCell>
                    <TableCell>{`${formatMoney(finance.value)}`}</TableCell>
                    <TableCell>{finance.description}</TableCell>
                    <TableCell>{formatDate(finance.date, true)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer><Stack spacing={2} sx={{ marginTop: 2 }} alignItems="left">
            <Pagination
              count={paginate?.last_page}
              page={paginate?.current_page}
              onChange={handlePageChange}
              variant="outlined"
              color="secondary"
              shape="rounded" />
          </Stack>
        </>
      }

    </Container>
  );
}

export default FinancialList;
