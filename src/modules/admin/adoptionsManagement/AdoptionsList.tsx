import {AddCircleOutlineOutlined, Close, Search} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import {AxiosResponse} from "axios";
import {useCallback, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {baseApi} from '../../../lib/api';
import FullLoader from '../../../shared/components/loading/FullLoader';
import useAuthStore from "../../../shared/store/authStore";
import {Paginate} from "../../../shared/types";
import {Adoption} from "./types";
import EditIcon from "@mui/icons-material/Edit";
import {Loading} from "../../../shared/components/loading/Loading.tsx";

const AdoptionStatusModal = ({ open, handleClose, id, actualStatus}) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await baseApi.put(`api/adoptions/${id}/${status}`);
      if (response.status === 200) {
        setLoading(false)
        handleClose();
      }
    } catch (error) {
      console.error('Erro ao atualizar o status da adoção:', error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h3" fontSize={'1.3rem'} component="h2">
          Alterar status da adoção
        </Typography>
        {loading ?
          <Box margin={'1rem 0'} >
            <Loading />   
          </Box> :
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
            >
              {actualStatus.toLowerCase() !== 'processing' && <MenuItem value="process">Adoção em andamento</MenuItem>}
              <MenuItem value="confirm">Confirmar adoção</MenuItem>
              <MenuItem value="cancel">Cancelar adoção</MenuItem>
              <MenuItem value="deny">Negar adoção</MenuItem>
            </Select>
          </FormControl>}
        <Button variant="contained" color="primary" onClick={handleSave} style={{marginTop: '1rem'}}>
          Salvar
        </Button>
      </Box>
    </Modal>
  );
};

function AdoptionsList() {
  const navigate = useNavigate();

  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginate, setPaginate] = useState<Paginate>();
  const [search, setSearch] = useState('');
  const isTokenRefreshed = useRef(false);
  const { user, setToken } = useAuthStore(state => ({
    user: state.userData,
    setToken: state.setToken
  }));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adoptionId, setAdoptionId] = useState(null);

  const handleOpenModal = (id) => {
    setAdoptionId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdoptionId(null);
    fetchAdoptions();
  };

  const fetchAdoptions = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/adoptions/?search=${search}&page=${page}`);
      const adoptions = response.data.data;
      console.log(adoptions)
      setAdoptions(adoptions);
      setPaginate(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
        console.log("Refreshing token...");
        try {
          isTokenRefreshed.current = true;
          const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
          const refreshToken = responseRefreshToken.data.newToken;
          setToken(refreshToken);
          fetchAdoptions(page);
        } catch (error) {
          navigate('/login');
        }
      } else {
        console.error("Failed to fetch adoptions:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [search, navigate]);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  const handleSearch = () => {
    fetchAdoptions();
  };

  const handlePageChange = (_, value) => {
    fetchAdoptions(value);
  };
  
  function handleStatus(status:string)
  {
    switch (status){
      case 'OPENED':
        return 'Aberto'
        break;
      case 'PROCESSING':
        return 'Processando'
        break;
      case 'ADOPTED':
        return 'Adotado'
        break;
      case 'CANCELLED':
        return 'Cancelado'
        break;
      case 'DENIED':
        return 'Negado'
        break;
    }
  }

  return (
    <Container maxWidth="xl" sx={{ marginY: 2, paddingBottom: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item>
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} >
            Listando <strong>{(paginate?.to ?? 0) - (paginate?.from ?? 0) + (paginate?.total === 0 ? 0 : 1)} adoções</strong> de <strong>{paginate?.total}</strong> no total
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
                  <TableCell width='10px' align='center' sx={{ fontWeight: '600' }}>Descrição</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Animal</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Usuário</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: '600' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adoptions.map((adoption) => (
                  <TableRow key={adoption.id}>
                    <TableCell>{adoption.description}</TableCell>
                    <TableCell>{adoption.animal.name}</TableCell>
                    <TableCell>{adoption.user.person.name}</TableCell>
                    <TableCell>{handleStatus(adoption.status)}</TableCell>
                    <TableCell>
                      {(adoption.status.toLowerCase() === 'opened' || adoption.status.toLowerCase() === 'processing') && <>
                        <IconButton onClick={() => handleOpenModal(adoption.id)}><EditIcon
                          color="warning"/></IconButton><AdoptionStatusModal
                        open={isModalOpen}
                        handleClose={handleCloseModal}
                        id={adoptionId}
                        actualStatus={adoption.status}/></>
                      }
                    </TableCell>
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

export default AdoptionsList;
