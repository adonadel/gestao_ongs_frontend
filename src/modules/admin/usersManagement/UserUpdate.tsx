import { AddPhotoAlternateOutlined, Search, Visibility, VisibilityOff } from '@mui/icons-material';
import { Avatar, Box, Button, Divider, FormControl, Grid, IconButton, InputAdornment, InputBaseComponentProps, InputLabel, MenuItem, Select, styled, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../../shared/components/loading/Loading';
import { Message } from '../../../shared/components/message/Message';
import { CustomProps, Role, User } from './types';
import baseApi from '../../../lib/api';

const TextMaskCpfCnpj = React.forwardRef<HTMLInputElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        const [mask, setMask] = useState('');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = event.target.value.replace(/[^\d]/g, '');
            const inputLength = inputValue.length;

            if (inputLength <= 11) {
                setMask('000.000.000-000');
            } else {
                setMask('00.000.000/0000-00');
            }

            onChange({ target: { name: props.name, value: inputValue } });
        }

        return (
            <IMaskInput
                {...other}
                mask={mask}
                definitions={{
                    '#': /[1-9]/,
                }}
                inputRef={ref}
                onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                overwrite
                onChange={handleChange}
            />
        );
    },
);


const UserUpdate: React.FC = () => {
    const navigate = useNavigate();
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const imageUrl = import.meta.env.VITE_URL_IMAGE;
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const isEditMode = !!id;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const TextMaskCep = React.forwardRef<HTMLInputElement, CustomProps>(
        function TextMaskCustom(props, ref) {
            const { onChange, ...other } = props;
            const [mask, setMask] = useState('');

            const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                const inputValue = event.target.value.replace(/[^\d]/g, '');
                setMask('00000-000');
                onChange({ target: { name: props.name, value: inputValue } });
            }

            return (
                <IMaskInput
                    {...other}
                    mask={mask}
                    definitions={{
                        '#': /[1-9]/,
                    }}
                    inputRef={ref}
                    onAccept={(value: string) => onChange({ target: { name: props.name, value } })}
                    overwrite
                    onChange={handleChange}
                />
            );
        },
    );
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
    const { register, handleSubmit, setValue, formState } = useForm<User>();
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
            navigate('/users');
        } catch (error) {
            setTextMessage('Ocorreu um erro ao salvar o usuário!');
            setTypeMessage('error');
            setOpenMessage(true);
        }
    };

    if (isEditMode && !user || !roles.length) {
        return <div>Loading...</div>;
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
                        <TextField
                            label='CPF/CNPJ'
                            type="text"
                            fullWidth
                            {...register('person.cpf_cnpj')}
                            defaultValue={isEditMode ? user?.person.cpf_cnpj : ''}
                            variant='outlined'
                            InputProps={{
                                inputComponent: TextMaskCpfCnpj as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
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
                            {...register('person.phone', { required: 'Telefone necessário', pattern: { value: /^[0-9]/i, message: 'Telefone inválido' } })}
                            error={!!formState.errors.person?.phone}
                            helperText={formState.errors.person?.phone?.message}
                            defaultValue={isEditMode ? user?.person.phone : ''}
                            variant='outlined'
                            fullWidth
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
                                        {...register('person.address.number')}
                                        defaultValue={isEditMode ? user?.person?.address?.number : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                            </>
                        )
                    }

                    <Grid item xs={12} sx={{ marginTop: '2rem' }}>
                        <Button type='submit' variant='contained' color="success" fullWidth size='large' disabled={isLoading}>
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
