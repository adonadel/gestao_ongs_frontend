import { Search } from "@mui/icons-material";
import { Avatar, Button, Grid, InputBaseComponentProps, Paper, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import axios, { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../../../lib/api.ts";
import useAuthStore from "../../../shared/store/authStore";
import { TextMaskCep, TextMaskTelephone } from "../../../shared/utils/masks.tsx";
import { ExternalUser as User } from "../../admin/usersManagement/types.ts";
import { Logout } from "../../auth/logout/Logout";

export const UserManagement = () => {
    const { userData } = useAuthStore((state) => ({
        userData: state.userData,
    }));
    const { setToken } = useAuthStore(state => ({
        user: state.userData,
        setToken: state.setToken
    }));
    const { userMe } = useAuthStore((state) => ({
        userMe: state.setUserData,
    }));
    const { register, handleSubmit, setValue, formState } = useForm<User>();
    const [cepSearched, setCepSearched] = useState<boolean>(false);
    const isTokenRefreshed = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const navigate = useNavigate();

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
            console.error(error);
        } finally {
            setCepSearched(true);
            setIsLoading(false);
        }
    }

    const onSubmit = async (data: User) => {
        try {
            const response = await baseApi.put(`/api/users/external/${userData.id}`, data);
            userMe(response.data);
            navigate('/admin/dashboard');
        } catch (error) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    onSubmit(data);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to fetch users:", error);
            }
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px', marginTop: '20px', maxWidth: '650px' }}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container justifyContent="center" alignItems="center" marginTop={4} spacing={2}>
                    <TextField
                        type="hidden"
                        {...register('person.id')}
                        defaultValue={userData?.person.id}
                        sx={{ display: 'none' }}
                    />
                    <Grid item>
                        <Avatar src={`https://drive.google.com/thumbnail?id=${userData?.person.profile_picture?.filename_id}`} sx={{ width: '180px', height: '180px', marginBottom: '48px' }} />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            label="Email"
                            value={userData?.person.email}
                            disabled
                            fullWidth
                            sx={{
                                'fieldset': { borderRadius: '6px' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} >
                        <TextField
                            label="CPF"
                            value={userData?.person.cpf_cnpj}
                            disabled
                            fullWidth
                            sx={{
                                'fieldset': { borderRadius: '6px' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nome"
                            value={userData?.person.name}
                            {...register('person.name')}
                            fullWidth
                            sx={{
                                'fieldset': { borderRadius: '6px' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Telefone'
                            type="text"
                            {...register('person.phone')}
                            error={!!formState.errors.person?.phone}
                            helperText={formState.errors.person?.phone?.message}
                            defaultValue={userData?.person.phone}
                            variant='outlined'
                            fullWidth
                            InputProps={{
                                inputComponent: TextMaskTelephone as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',

                    }}>
                        <TextField
                            label='CEP'
                            type='text'
                            id='inputCep'
                            {...register('person.address.zip')}
                            defaultValue={userData?.person?.address?.zip}
                            variant='outlined'
                            InputProps={{
                                inputComponent: TextMaskCep as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
                            onBlur={searchCEP}
                            fullWidth
                        />
                        <IconButton
                            onClick={searchCEP}
                            sx={{
                                border: '1px solid',
                                borderColor: 'primary.dark',
                                borderRadius: '4px',
                                padding: '7px'
                            }}>
                            <Search />
                        </IconButton>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label='Estado'
                            disabled
                            type='text'
                            {...register('person.address.state')}
                            defaultValue={userData?.person?.address?.state}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Cidade'
                            disabled
                            type='text'
                            {...register('person.address.city')}
                            defaultValue={userData?.person?.address?.city}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Bairro'
                            type='text'
                            {...register('person.address.neighborhood')}
                            defaultValue={userData?.person?.address?.neighborhood}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Rua'
                            type='text'
                            {...register('person.address.street')}
                            defaultValue={userData?.person?.address?.street}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Complemento'
                            type='text'
                            {...register('person.address.complement')}
                            defaultValue={userData?.person?.address?.complement}
                            variant='outlined'
                            fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Número da residência'
                            type='text'
                            {...register('person.address.number', { maxLength: { value: 10, message: 'Número deve ter no máximo 10 dígitos' } })}
                            error={!!formState.errors.person?.address?.number}
                            helperText={formState.errors.person?.address?.number?.message}
                            defaultValue={userData?.person?.address?.number}
                            variant='outlined'
                            fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                        <Button type='submit' variant='contained' color="success" fullWidth disabled={isLoading}>
                            Salvar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Logout />
                    </Grid>
                </Grid>
            </form>
        </Paper>
    )
}