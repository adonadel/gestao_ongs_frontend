import {AddCircleOutlineOutlined, Close, Search} from '@mui/icons-material';
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
import {AxiosResponse} from "axios";
import {useCallback, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {baseApi} from '../../../lib/api';
import FullLoader from '../../../shared/components/loading/FullLoader';
import useAuthStore from '../../../shared/store/authStore';
import {Paginate} from '../../../shared/types';
import {Animal} from './types';

function AnimalList() {
    const navigate = useNavigate();
    const isTokenRefreshed = useRef(false);

    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, setToken } = useAuthStore(state => ({
        user: state.userData,
        setToken: state.setToken
    }));
    const [paginate, setPaginate] = useState<Paginate>();
    const [search, setSearch] = useState('');

    const fetchAnimals = useCallback(async (page = 1) => {
        setIsLoading(true);
        try {
            const response: AxiosResponse = await baseApi.get(`/api/animals/?search=${search}&page=${page}&for-adoption=false`);
            setPaginate(response.data);
            setAnimals(response.data.data);
        } catch (error: any) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    fetchAnimals(page);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to fetch animals:", error);
            }
        } finally {
            setIsLoading(false);
        }
    }, [search, navigate]);

    useEffect(() => {
        if(!user?.role.permissions.filter(permission => permission.name === "animal-view").length > 0) {
            navigate('/admin/dashboard');
        }
        fetchAnimals();
    }, [fetchAnimals]);

    const handleSearch = () => {
        fetchAnimals();
    };

    const handlePageChange = (_, value) => {
        fetchAnimals(value);
    };

    return (
        <Container maxWidth="xl" sx={{ marginY: 2, paddingBottom: 4 }} >
            <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
                <Grid item>
                    <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} >
                        Listando <strong>{(paginate?.to ?? 0) - (paginate?.from ?? 0) + (paginate?.total === 0 ? 0 : 1)} animais</strong> de <strong>{paginate?.total}</strong> no total
                    </Typography>
                </Grid>
                <Grid item display='flex'>
                    <OutlinedInput
                        placeholder='Pesquisar por nome, descrição ou tags'
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
                    {
                        user?.role.permissions.filter(permission => permission.name === "animal-create").length > 0 ?
                          (<Button
                            variant='contained'
                            color='success'
                            component={Link}
                            to="new"
                            endIcon={<AddCircleOutlineOutlined fontSize="inherit"/>}
                            sx={{
                                padding: '10px',
                                borderRadius: '10px',
                            }}
                          >
                              <Typography fontSize="inherit" marginBottom={'0'}
                                          sx={{textTransform: 'none'}}>Novo</Typography>
                          </Button>) : 
                          <></>
                    }
                </Grid>
            </Grid>

            {isLoading ?
                <FullLoader />
                :
                <><TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                                <TableCell sx={{ fontWeight: '600' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Gênero</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Tamanho</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Idade</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Descrição</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Tags</TableCell>
                                <TableCell sx={{ fontWeight: '600' }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {animals.map((animal) => (
                                <TableRow key={animal.id}>
                                    <TableCell>{animal.id}</TableCell>
                                    <TableCell>{animal.name}</TableCell>
                                    <TableCell>
                                        {animal.animal_type === 'DOG' ? 'Cachorro' : animal.animal_type === 'CAT' ? 'Gato' : 'Outro'}
                                    </TableCell>
                                    <TableCell>
                                        {animal.gender === 'FEMALE' ? 'Fêmea' : 'Macho'}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            animal.size === 'SMALL' ? 'Pequeno' :
                                                animal.size === 'MEDIUM' ? 'Médio' :
                                                    animal.size === 'LARGE' ? 'Grande' :
                                                        animal.size === 'VERY_LARGE' ? 'Muito Grande' :
                                                            'Desconhecido'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            animal.age_type === 'CUB' ? 'Filhote' :
                                                animal.age_type === 'TEEN' ? 'Adolescente' :
                                                    animal.age_type === 'ADULT' ? 'Adulto' :
                                                        animal.age_type === 'ELDERLY' ? 'Idoso' :
                                                            'Desconhecido'
                                        }
                                    </TableCell>
                                    <TableCell>{animal.description}</TableCell>
                                    <TableCell>{animal.tags}</TableCell>
                                    <TableCell>
                                        {user?.role.permissions.filter(permission => permission.name === "animal-update").length > 0 ?
                                            <IconButton component={Link} to={`${animal.id}`}><EditIcon color="warning"/></IconButton> :
                                          <></>
                                        }
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
                            variant='outlined'
                            color='secondary'
                            shape='rounded'
                        />
                    </Stack>
                </>
            }
        </Container>
    )
}

export default AnimalList;