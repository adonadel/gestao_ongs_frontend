import {
  Button,
  Container,
  Grid,
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
import {Financial} from './types';
import {AddCircleOutlineOutlined, ArrowDownward, ArrowUpward, AttachMoney} from '@mui/icons-material';
import {grey} from '@mui/material/colors';
import {baseApi} from '../../../lib/api';

const IncomeIcon = () => {
  return (
    <span
      style={{
        display: "flex",
        justifyContent: "Center",
        alignItems: "Center",
        marginLeft: "5px"
      }}
    >
      <>
        <AttachMoney
          style={{
            color: '#4caf50'
          }}
        />
        <ArrowUpward
          style={{
          marginLeft: '-5px',
            color: '#4caf50'
          }}
        /> 
      </>
    </span>
  );
}

const ExpenseIcon = () => {
  return (
    <span
      style={{
        display: "flex",
        justifyContent: "Center",
        alignItems: "Center",
      }}
    >
    <>
      <AttachMoney
        style={{
          color: '#f44336'
        }}
      />
      <ArrowDownward
        style={{
          marginLeft: '-5px',
          color: '#f44336'
          
        }}
      />
    </>
    </span>
  );
}

function FinancialList() {
  const [finances, setFinancials] = useState<Financial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFinancials = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse = await baseApi.get(`/api/finances`);
      const finances = response.data.data;
      setFinancials(finances);
    } catch (error) {
      console.error('Error fetching finances:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFinancials();
  }, []);
    
  function formatDate(date:string, usToBr:boolean = false)
  {
    let splitted;
    if (usToBr) {
        splitted = date.split('-')
        return splitted.reverse().join('/');
    }
    splitted = date.split('/');
    return splitted.reverse().join('-');
  }
  
  function formatMoney(value:number)
  {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  return (
     <Container maxWidth="xl">
      <Grid container justifyContent="space-between" alignItems="center" marginBottom={"1rem"}>
        <Grid item> 
          {
            finances.length <= 1 &&
            <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'} color={grey[500]}>Finanças</Typography>
          }
          <Typography variant="h3" fontSize={'1rem'} fontWeight={'medium'}>Listando {finances.length} Finanças</Typography>
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
                <TableCell width='10px' align='center'>Tipo</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finances.map((finance) => (
                <TableRow key={finance.id}>
                  <TableCell width='10px'>
                    {
                    finance.type === 'INCOME' ?
                      <IncomeIcon/>:
                      <ExpenseIcon/>
                      
                  }
                  </TableCell>
                  <TableCell>{`${formatMoney(finance.value)}`}</TableCell>
                  <TableCell>{finance.description}</TableCell>
                  <TableCell>{formatDate(finance.date, true)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
      </Container>

  )
}

export default FinancialList;