import { AddPhotoAlternateOutlined, Search, Visibility, VisibilityOff } from '@mui/icons-material';
import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, InputAdornment, InputBaseComponentProps, InputLabel, MenuItem, Select, TextField, Typography, styled } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { baseApi } from '../../../lib/api';
import FullLoader from '../../../shared/components/loading/FullLoader';
import { Loading } from '../../../shared/components/loading/Loading';
import { Message } from '../../../shared/components/message/Message';
import useAuthStore from '../../../shared/store/authStore';
import { TextMaskCep, TextMaskCpfCnpj, TextMaskTelephone } from '../../../shared/utils/masks';
import { isValidCNPJ, isValidCPF } from '../../../shared/utils/validate';
import { Role, User, UserType } from './types';

const UserUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const imageUrl = import.meta.env.VITE_URL_IMAGE;
    const isTokenRefreshed = useRef(false);

    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const isEditMode = !!id;
    const { userLogged, setToken } = useAuthStore(state => ({
        user: state.userData,
        setToken: state.setToken
    }));
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });
    const { control, register, handleSubmit, setValue, formState } = useForm<User>();
    const [srcUserProfile, setSrcUserProfile] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState(false);
    const [cepSearched, setCepSearched] = useState<boolean>(false);

    const handleClose = () => {
        setOpenMessage(false);
    }

    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);

    const postImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validImageTypes = ['image/jpeg', 'image/png'];

        if (!validImageTypes.includes(file.type)) {
            setTextMessage('Selecione um arquivo de imagem do tipo: JPEG, JPG ou PNG');
            setTypeMessage('error');
            setOpenMessage(true);
            return;
        }

        const tempSrcImage = URL.createObjectURL(file);
        setSrcUserProfile(tempSrcImage);
        setIsLoading(true);

        const formData = new FormData();
        formData.append('media', file);
        formData.append('origin', 'user');

        try {
            const response = await baseApi.post(`/api/medias/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const media = response.data;
            setValue('person.profile_picture_id', media.id);
            setSrcUserProfile(`${imageUrl + media.filename_id}`);

        } catch (error) {
            if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                console.log("Refreshing token...");
                try {
                    isTokenRefreshed.current = true;
                    const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                    const refreshToken = responseRefreshToken.data.newToken;
                    setToken(refreshToken);
                    postImage(event);
                } catch (error) {
                    navigate('/login');
                }
            } else {
                console.error("Failed to fetch users:", error);
            }
            setTextMessage('Ocorreu um erro com o upload da imagem, tente novamente!');
            setTypeMessage('error');
            setOpenMessage(true);
            console.error(error);
        } finally {
            setTextMessage('Upload de imagem concluído!');
            setTypeMessage('info');
            setOpenMessage(true);
            setIsLoading(false);
            URL.revokeObjectURL(tempSrcImage);
        }
    };

    const openImagePicker = () => {
        const input = document.getElementById('inputImagePicker') as HTMLInputElement;
        input.click();
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

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

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await baseApi.get(`/api/roles`);
                const roles = response.data.data;
                setRoles(roles);
            } catch (error) {
                if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                    console.log("Refreshing token...");
                    try {
                        isTokenRefreshed.current = true;
                        const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                        const refreshToken = responseRefreshToken.data.newToken;
                        setToken(refreshToken);
                        fetchRoles();
                    } catch (error) {
                        navigate('/login');
                    }
                } else {
                    console.error("Failed to fetch users:", error);
                }
                setTextMessage('Ocorreu um erro ao acessar essa página!');
                setTypeMessage('error');
                setOpenMessage(true);
            }
        }
        fetchRoles();
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const response = await baseApi.get(`/api/users/${id}`);
                    const user = response.data;
                    setSrcUserProfile(`${imageUrl + user?.person?.profile_picture?.filename_id}`);
                    setUser(user);
                } catch (error) {
                    if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
                        console.log("Refreshing token...");
                        try {
                            isTokenRefreshed.current = true;
                            const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
                            const refreshToken = responseRefreshToken.data.newToken;
                            setToken(refreshToken);
                            fetchUser();
                        } catch (error) {
                            navigate('/login');
                        }
                    } else {
                        console.error("Failed to fetch users:", error);
                    }
                    setTextMessage('Ocorreu um erro ao acessar essa página!');
                    setTypeMessage('error');
                    setOpenMessage(true);
                }
            };
            fetchUser();
        }
    }, [id, isEditMode, navigate]);

    const onSubmit = async (data: User) => {
        try {
            if (isEditMode) {

                await baseApi.put(`/api/users/${id}`, data);
            } else {
                await baseApi.post(`/api/users`, data);
            }
            navigate('/admin/users');
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
            setTextMessage('Ocorreu um erro ao salvar o usuário!');
            setTypeMessage('error');
            setOpenMessage(true);
        }
    };

    const isValidCPFOrCNPJ = (input: string): boolean => {
        const cleanedInput = input.replace(/[^\d]+/g, '');
        if (cleanedInput.length === 11) {
            return isValidCPF(cleanedInput);
        } else if (cleanedInput.length === 14) {
            return isValidCNPJ(cleanedInput);
        }
        return false;
    };


    if (isEditMode && !user || !roles.length) {
        return <FullLoader />;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    type="hidden"
                    {...register('person.id')}
                    defaultValue={isEditMode ? user?.person.id : ''}
                    sx={{ display: 'none' }}
                />
                <Grid
                    item
                    container
                    spacing={2}
                    sm={12}
                    md={8}
                    lg={6}
                    sx={{
                        border: 'solid 0.5px',
                        borderColor: 'primary.light',
                        boxShadow: '0px 4px 4px rgba(55, 55, 55, 0.25)',
                        padding: '20px',
                        borderRadius: '10px'
                    }}>

                    <Grid
                        item xs={12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Box
                            position='relative'
                            onClick={openImagePicker}
                            sx={{
                                width: 'fit-content',
                                cursor: 'pointer',
                                '&:hover .hoverBox': {
                                    visibility: 'visible',
                                }

                            }}
                        >
                            <Avatar
                                sx={{ width: '64px', height: '64px' }}
                                alt={isEditMode ? user?.person.name : 'Imagem de perfil'}
                                src={srcUserProfile ? `${srcUserProfile}` : ''}
                            />

                            <VisuallyHiddenInput id="inputImagePicker" accept='image/*' type="file" onChange={postImage} />
                            <input id="inputPictureId" type="hidden" accept='image/*' {...register('person.profile_picture_id')} />

                            <Box className="hoverBox"
                                sx={{
                                    display: 'flex',
                                    visibility: 'hidden',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    backdropFilter: 'blur(5px)',
                                    borderRadius: '50%',
                                }}
                            >

                                <AddPhotoAlternateOutlined
                                    sx={
                                        {
                                            display: 'block',
                                            color: 'white',
                                            width: '50%',
                                            zIndex: 1
                                        }
                                    }
                                />
                            </Box>
                        </Box>

                        <TextField
                            label='Nome completo'
                            type='text'
                            {...register('person.name')}
                            defaultValue={isEditMode ? user?.person.name : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='E-mail'
                            type="email"
                            {...register('person.email', { required: 'E-mail necessário', pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i, message: 'E-mail inválido' } })}
                            error={!!formState.errors.person?.email}
                            helperText={formState.errors.person?.email?.message}
                            defaultValue={isEditMode ? user?.person.email : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="person.cpf_cnpj"
                            control={control}
                            rules={{
                                required: "CPF/CNPJ obrigatorios",
                                validate: value => isValidCPFOrCNPJ(value) || "CPF/CNPJ inválido"
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label='CPF/CNPJ'
                                    type="text"
                                    fullWidth
                                    {...register('person.cpf_cnpj')}
                                    defaultValue={isEditMode ? user?.person.cpf_cnpj : ''}
                                    variant='outlined'
                                    InputProps={{
                                        inputComponent: TextMaskCpfCnpj as unknown as React.ElementType<InputBaseComponentProps>,
                                    }}
                                    error={!!formState.errors.person?.cpf_cnpj}
                                    helperText={formState.errors.person?.cpf_cnpj?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '.5rem',
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="role-label">Nível de acesso</InputLabel>
                            <Select
                                labelId="role-label"
                                label='Nível de acesso'
                                {...register('role_id')}
                                defaultValue={isEditMode ? user?.role_id : roles[0]['id']}
                                variant='outlined'
                                fullWidth
                            >
                                <MenuItem disabled value="">
                                    <Typography sx={{ fontStyle: 'italic' }}>Selecione ou crie um nível</Typography>
                                </MenuItem>
                                {roles && roles.map((role: Role) => (
                                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Telefone'
                            type="text"
                            {...register('person.phone', { required: 'Telefone necessário' })}
                            error={!!formState.errors.person?.phone}
                            helperText={formState.errors.person?.phone?.message}
                            defaultValue={isEditMode ? user?.person.phone : ''}
                            variant='outlined'
                            fullWidth
                            InputProps={{
                                inputComponent: TextMaskTelephone as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
                        />
                    </Grid>

                    {!isEditMode && (
                        <Grid item xs={6}>
                            <TextField
                                label='Senha'
                                type={showPassword ? "text" : "password"}
                                disabled={isEditMode}
                                {...register('password', {
                                    required: 'Senha necessária', minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }, pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?\\/]{6,}$/
                                        , message: 'Senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, uma minúscula e números'
                                    }
                                })}
                                error={!!formState.errors.password}
                                helperText={formState.errors.password?.message}
                                variant='outlined'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                        </Grid>
                    )}

                    <Grid item xs={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '.5rem',
                        }}
                    >
                        <FormControl fullWidth>
                            <InputLabel id="type-label">Tipo de usuário</InputLabel>
                            <Select
                                labelId="type-label"
                                label='Tipo de usuário'
                                {...register('type')}
                                defaultValue={isEditMode ? user?.role_id : roles[0]['id']}
                                variant='outlined'
                                fullWidth
                            >
                                <MenuItem disabled value="">
                                    <Typography sx={{ fontStyle: 'italic' }}>Selecione o tipo do usuário</Typography>
                                </MenuItem>
                                {Object.values(UserType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type === UserType.INTERNAL ? 'Interno' : 'Externo'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Endereço</Typography>
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
                            defaultValue={isEditMode ? user?.person?.address?.zip : ''}
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
                            }}>
                            <Search />
                        </IconButton>
                    </Grid>
                    {
                        (cepSearched || isEditMode) && (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Estado'
                                        disabled
                                        type='text'
                                        {...register('person.address.state')}
                                        defaultValue={isEditMode ? user?.person?.address?.state : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Cidade'
                                        disabled
                                        type='text'
                                        {...register('person.address.city')}
                                        defaultValue={isEditMode ? user?.person?.address?.city : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Bairro'
                                        type='text'
                                        {...register('person.address.neighborhood')}
                                        defaultValue={isEditMode ? user?.person?.address?.neighborhood : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Rua'
                                        type='text'
                                        {...register('person.address.street')}
                                        defaultValue={isEditMode ? user?.person?.address?.street : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Complemento'
                                        type='text'
                                        {...register('person.address.complement')}
                                        defaultValue={isEditMode ? user?.person?.address?.complement : ''}
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
                                        defaultValue={isEditMode ? user?.person?.address?.number : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                            </>
                        )
                    }

                    <Grid item xs={12} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Button type='button' size='large' variant='contained' color="primary" onClick={() => navigate(-1)} sx={{ width: '20%' }} disabled={isLoading}>
                            Voltar
                        </Button>
                        <Button type='submit' size='large' variant='contained' color="success" sx={{ width: '80%' }} disabled={isLoading}>
                            {isEditMode ? 'Salvar' : 'Criar'}
                        </Button>
                    </Grid>

                    {
                        isLoading && (
                            <Loading />
                        )
                    }

                    <Message
                        message={textMessage}
                        type={typeMessage}
                        open={openMessage}
                        onClose={handleClose}
                    />
                </Grid>
            </form>
        </>
    );
};

export default UserUpdate;
