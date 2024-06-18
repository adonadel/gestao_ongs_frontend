import { Search } from "@mui/icons-material";
import { Box, Grid, IconButton, InputBaseComponentProps, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextMaskCep } from "../../../shared/utils/masks";
import { ExternalUser } from "../../admin/usersManagement/types";

export default function StepAddress() {
    const { register, setValue } = useFormContext<ExternalUser>();
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const [cepSearched, setCepSearched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);

    const searchCEP = async () => {
        const cep = (document.getElementById('inputCep') as HTMLInputElement).value;
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiCepUrl}/${cep}/json/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const data = response.data;
            setValue('person.address.state', data.uf);
            setValue('person.address.city', data.localidade);
            setValue('person.address.neighborhood', data.bairro);
            setValue('person.address.street', data.logradouro);
            setValue('person.address.complement', data.complemento);

        } catch (error) {
            setTextMessage('CEP inválido, tente novamente!');
            setTypeMessage('error');
            setOpenMessage(true);
            console.error(error);
        } finally {
            setTextMessage('Campos preenchidos automaticamente!');
            setTypeMessage('info');
            setOpenMessage(true);
            setCepSearched(true);
            setIsLoading(false);
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box display='flex'>
                    <TextField
                        label='CEP'
                        type='text'
                        id='inputCep'
                        {...register('person.address.zip')}
                        variant='outlined'
                        InputProps={{
                            inputComponent: TextMaskCep as unknown as React.ElementType<InputBaseComponentProps>,
                        }}
                        required
                        onBlur={searchCEP}
                        sx={{ mr: 1 }}
                    />
                    <IconButton
                        onClick={searchCEP}
                        sx={{
                            border: '1px solid',
                            borderColor: 'primary.dark',
                            borderRadius: '4px',
                        }}>
                        <Search />
                    </IconButton>
                </Box>
            </Grid>
            {cepSearched &&
                <><Grid item xs={6}>
                    <TextField
                        label='Estado'
                        type='text'
                        {...register('person.address.state')}
                        defaultValue={''}
                        variant='outlined'
                        fullWidth
                        required />
                </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Cidade'
                            type='text'
                            {...register('person.address.city')}
                            defaultValue={''}
                            variant='outlined'
                            fullWidth
                            required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Bairro'
                            type='text'
                            {...register('person.address.neighborhood')}
                            defaultValue={''}
                            variant='outlined'
                            fullWidth
                            required />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Rua'
                            type='text'
                            {...register('person.address.street')}
                            defaultValue={''}
                            variant='outlined'
                            fullWidth
                            required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Complemento'
                            type='text'
                            {...register('person.address.complement')}
                            defaultValue={''}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Número da residência'
                            type='text'
                            {...register('person.address.number')}
                            defaultValue={''}
                            variant='outlined'
                            fullWidth
                            required />
                    </Grid>
                </>
            }
        </Grid>
    )
}