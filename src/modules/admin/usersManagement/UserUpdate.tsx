import { AddPhotoAlternateOutlined, CreateOutlined, Search, Visibility, VisibilityOff } from '@mui/icons-material';
import { Avatar, Box, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment, InputBaseComponentProps, LinearProgress, MenuItem, Select, TextField, Typography, styled } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../../../shared/reducers/userReducer';
import { getToken } from '../../../shared/utils/getToken';
import PermissionsDialog from '../rolesManagement/PermissionsDialog';
import { CustomProps, Role, User } from './types';

const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
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
    const apiUrl = import.meta.env.VITE_API_URL;
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [shrinkInput, setShrinkInput] = useState(false);
    const logout = useUserStore(state => state.logout);
    const isEditMode = !!id;
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const postImage = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (!file) return;

        const validImageTypes = ['image/jpeg', 'image/png'];
        //Verificando tipo de imagem
        if (!validImageTypes.includes(file.type)) {
            console.error('Invalid image type:', file.type);
            return;
        }

        const tempSrcImage = URL.createObjectURL(file);
        setSrcUserProfile(tempSrcImage);
        setIsLoading(true);        

        const formData = new FormData();
        formData.append('media', file);

        try {
            const token = getToken();
            const response = await axios.post(`${apiUrl}/api/medias/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const media = response.data;
            setValue('person.profile_picture_id', media.id);
            setSrcUserProfile(`https://drive.google.com/thumbnail?id=${media.filename_id}`);

        } catch (error) {
            console.error(error);
        } finally {
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

    const handleClickOpen = () => {
        setIsModalOpen(true);
    }


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
            setShrinkInput(true);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = getToken();

                const response = await axios.get(`${apiUrl}/api/roles`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const roles = response.data.data;
                setRoles(roles);
            } catch (error) {
                logout();
            }
        }
        fetchRoles();
    }, [])

    useEffect(() => {
        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const token = getToken();
                    const response = await axios.get(`${apiUrl}/api/users/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const user = response.data;
                    setSrcUserProfile(`https://drive.google.com/thumbnail?id=${user?.person?.profile_picture?.filename_id}`);
                    setUser(user);
                } catch (error) {
                    logout();
                }
            };
            fetchUser();
        }
    }, [id, isEditMode, navigate]);



    const onSubmit = async (data: User) => {
        try {
            const token = getToken();
            if (isEditMode) {

                await axios.put(`${apiUrl}/api/users/${id}`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                await axios.post(`${apiUrl}/api/users`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            navigate('/users');
        } catch (error) {
            logout();
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
                                src={isEditMode ? `${srcUserProfile}` : ''}
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
                    <Grid item xs={12} sm={9} md={10}>
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
                                inputComponent: TextMaskCustom as unknown as React.ElementType<InputBaseComponentProps>,
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
                        <Select
                            labelId="role-label"
                            label='Nível de acesso'
                            {...register('role_id')}
                            defaultValue={isEditMode ? user?.role_id : roles[0]['id']}
                            variant='outlined'
                            fullWidth={true}
                        >
                            <MenuItem disabled value="">
                                <em>Selecione ou crie um nível</em>
                            </MenuItem>
                            {roles && roles.map((role: Role) => (
                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                            ))}
                        </Select>
                        <IconButton onClick={handleClickOpen}
                            sx={{
                                border: '1px solid',
                                borderColor: 'primary.dark',
                                borderRadius: '4px',
                            }}>
                            <CreateOutlined />
                        </IconButton>
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
                    <Grid item xs={6}>
                        <TextField
                            label='Estado'
                            type='text'
                            {...register('person.address.state')}
                            defaultValue={isEditMode ? user?.person?.address?.state : ''}
                            variant='outlined'
                            InputLabelProps={{ shrink: shrinkInput }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Cidade'
                            type='text'
                            {...register('person.address.city')}
                            defaultValue={isEditMode ? user?.person?.address?.city : ''}
                            variant='outlined'
                            InputLabelProps={{ shrink: shrinkInput }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Bairro'
                            type='text'
                            {...register('person.address.neighborhood')}
                            defaultValue={isEditMode ? user?.person?.address?.neighborhood : ''}
                            variant='outlined'
                            InputLabelProps={{ shrink: shrinkInput }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Rua'
                            type='text'
                            {...register('person.address.street')}
                            defaultValue={isEditMode ? user?.person?.address?.street : ''}
                            variant='outlined'
                            InputLabelProps={{ shrink: shrinkInput }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Complemento'
                            type='text'
                            {...register('person.address.complement')}
                            defaultValue={isEditMode ? user?.person?.address?.complement : ''}
                            variant='outlined'
                            InputLabelProps={{ shrink: shrinkInput }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label='Número da residência'
                            type='text'
                            {...register('person.address.number')}
                            defaultValue={isEditMode ? user?.person?.address?.number : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>

                    <PermissionsDialog open={isModalOpen} onClose={() => setIsModalOpen(false)} permissions={[]} roleName={''} />
                    <Grid item xs={12} sx={{ marginTop: '2rem' }}>
                        <Button type='submit' variant='contained' color="success" fullWidth size='large' disabled={isLoading}>
                            {isEditMode ? 'Salvar' : 'Criar'}
                        </Button>
                    </Grid>

                    {
                        isLoading && (
                            <Grid item xs={12}>
                                <Box sx={{ width: '80%', margin: '0 auto' }}>
                                    <LinearProgress color='secondary' />
                                </Box>
                            </Grid>
                        )
                    }

                </Grid>
            </form>
        </>
    );
};

export default UserUpdate;
