import EditIcon from '@mui/icons-material/Edit';
import { Button, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseApi } from '../../../lib/api';

interface Animal {
    id: number;
    name: string;
    gender: string;
    size: string;
    age_type: string;
    description: string;
    tags: string;
    created_at: string;
}

interface PaginatedAnimalResponse {
    data: Animal[];
}

function AnimalList() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnimals = async () => {
        try {
            const response: AxiosResponse<PaginatedAnimalResponse> = await baseApi.get<PaginatedAnimalResponse>(`/api/animals`)
            setAnimals(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching animals:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ paddingY: '10px' }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography variant="h3">Animais</Typography>
                </Grid>
                <Grid item>
                    <Button variant='contained' color='primary' component={Link} to="new">
                        <Typography>Adicionar Animal</Typography>
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
                                <TableCell>Gênero</TableCell>
                                <TableCell>Tamanho</TableCell>
                                <TableCell>Idade</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Tags</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {animals.map((animal) => (
                                <TableRow key={animal.id}>
                                    <TableCell>{animal.id}</TableCell>
                                    <TableCell>{animal.name}</TableCell>
                                    <TableCell>{animal.gender}</TableCell>
                                    <TableCell>{animal.size}</TableCell>
                                    <TableCell>{animal.age_type}</TableCell>
                                    <TableCell>{animal.description}</TableCell>
                                    <TableCell>{animal.tags}</TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`${animal.id}`}><EditIcon color="warning" /></IconButton>
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

export default AnimalList;