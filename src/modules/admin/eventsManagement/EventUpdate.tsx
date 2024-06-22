import { AddPhotoAlternateOutlined, Delete, Search } from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    InputBaseComponentProps,
    TextField,
    Typography,
    styled
} from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from "react-imask";
import { useNavigate, useParams } from 'react-router-dom';
import { baseApi } from '../../../lib/api';
import { Loading } from '../../../shared/components/loading/Loading';
import { Message } from '../../../shared/components/message/Message';
import { CustomProps, Event } from './types';

const EventUpdate: React.FC = () => {
    const navigate = useNavigate();
    const imageUrl = import.meta.env.VITE_URL_IMAGE;
    const apiCepUrl = import.meta.env.VITE_API_CEP;
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const isEditMode = !!id;
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
    const { register, handleSubmit, setValue } = useForm<Event>();
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<string>('');
    const [srcImage, setSrcImage] = useState<string | null>('');
    const [dateError, setDateError] = useState('');
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
    const [cepSearched, setCepSearched] = useState<boolean>(false);

    const handleClose = () => {
        setOpenMessage(false);
    }

    const [textMessage, setTextMessage] = useState('Mensagem padrão');
    const [typeMessage, setTypeMessage] = useState('warning');
    const [openMessage, setOpenMessage] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

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
        setSrcImage(tempSrcImage);
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

            setImage(media.id.toString());
            setSrcImage(`${imageUrl + media.filename_id}`);
            setValue('medias', media.id.toString());

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

    const handleDeleteImage = (id: number) => {
        try {
            baseApi.delete(`/api/medias/${id}`);
        } catch (error) {
            console.log("Error:", error);
        }

        setImage('');
        setSrcImage('');
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
            setValue('address.state', data.uf);
            setValue('address.city', data.localidade);
            setValue('address.neighborhood', data.bairro);
            setValue('address.street', data.logradouro);
            setValue('address.complement', data.complemento);

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
        if (isEditMode) {
            const fetchEvent = async () => {
                try {
                    const response = await baseApi.get(`/api/events/${id}`);

                    const event = response.data;
                    const formatted = formatDate(event.event_date, true);
                    event.event_date = formatted;
                    setSelectedDate(dayjs(formatted, 'DD/MM/YYYY'));
                    setEvent(event);
                    const eventMedia = event.medias[0];
                    setImage(eventMedia.id.toString());
                    setSrcImage(`${imageUrl + eventMedia.filename_id}`);
                    setValue('medias', eventMedia.id.toString());
                } catch (error) {
                    setTextMessage('Ocorreu um erro ao acessar essa página!');
                    setTypeMessage('error');
                    setOpenMessage(true);
                }
            };
            fetchEvent();
        }
    }, [id, isEditMode, navigate]);

    function formatDate(date: string, usToBr: boolean = false) {
        let splitted;
        if (usToBr) {
            splitted = date.split('-')
            return splitted.reverse().join('/');
        }
        splitted = date.split('/');
        return splitted.reverse().join('-');
    }

    const onSubmit = async (data: Event) => {
        try {
            const eventDate = formatDate(data.event_date);
            data.event_date = eventDate;
            if (isEditMode) {
                await baseApi.put(`/api/events/${id}`, data);
            } else {
                await baseApi.post(`/api/events`, data);
            }
            navigate('/admin/events');
        } catch (error) {
            setTextMessage('Ocorreu um erro ao salvar o evento!');
            setTypeMessage('error');
            setOpenMessage(true);
        }
    };

    if (isEditMode && !event) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                    type="hidden"
                    {...register('address_id')}
                    defaultValue={isEditMode ? event?.address_id : ''}
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

                            <VisuallyHiddenInput id="inputImagePicker" accept='image/*' type="file" onChange={postImage} />

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
                            label='Nome'
                            type='text'
                            {...register('name')}
                            defaultValue={isEditMode ? event?.name : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Descrição"
                            multiline minRows={4} maxRows={6}
                            type="text"
                            {...register('description')}
                            defaultValue={isEditMode ? event?.description : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label='Local'
                            type="text"
                            {...register('location')}
                            defaultValue={isEditMode ? event?.location : ''}
                            variant='outlined'
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DatePicker
                                label='Data do Evento'
                                value={selectedDate}
                                format='DD/MM/YYYY'
                                onChange={(date) => {
                                    if (date) {
                                        const formattedDate = date.format('DD/MM/YYYY');
                                        setSelectedDate(date);
                                        setValue('event_date', formattedDate);
                                    } else {
                                        setSelectedDate(null);
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        ...register('event_date'),
                                        error: dateError && dateError === 'minDate' ? true : undefined,
                                        helperText: dateError && dateError === 'minDate' ? 'Informe uma data maior ou igual à hoje' : ''
                                    }
                                }}
                                minDate={dayjs(new Date())}
                                disablePast={true}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid
                        item xs={12}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Box
                            position='relative'
                            sx={{
                                width: '6rem',
                                height: '6rem',
                                cursor: 'pointer',
                                '&:hover .hoverBox': {
                                    visibility: 'visible',
                                }

                            }}
                        >

                            <VisuallyHiddenInput id="inputImagePicker" accept='image/*' type="file" onChange={postImage} />

                            {(image !== '' || srcImage !== '') && <Avatar
                                alt="Imagem"
                                src={srcImage !== '' ? `${srcImage}` : ''}
                                variant='rounded'
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: '1',
                                }}

                            />}
                            {srcImage !== '' && !isLoading && <IconButton
                                color="error"
                                onClick={() => handleDeleteImage(image)}
                                sx={{
                                    position: 'absolute',
                                    bottom: '0',
                                    zIndex: '999',
                                    right: '0',
                                }}>
                                <Delete sx={{
                                    fontSize: '0.8rem',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    padding: '0.2rem',

                                }} />
                            </IconButton>}
                            <Box
                                onClick={openImagePicker}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    backdropFilter: 'blur(5px)',
                                    borderRadius: '0.5rem',
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
                            {...register('address.zip')}
                            defaultValue={isEditMode ? event?.address?.zip : ''}
                            variant='outlined'
                            InputProps={{
                                inputComponent: TextMaskCep as unknown as React.ElementType<InputBaseComponentProps>,
                            }}
                            fullWidth
                            onBlur={searchCEP}
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
                                        {...register('address.state')}
                                        defaultValue={isEditMode ? event?.address?.state : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Cidade'
                                        disabled
                                        type='text'
                                        {...register('address.city')}
                                        defaultValue={isEditMode ? event?.address?.city : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Bairro'
                                        type='text'
                                        {...register('address.neighborhood')}
                                        defaultValue={isEditMode ? event?.address?.neighborhood : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Rua'
                                        type='text'
                                        {...register('address.street')}
                                        defaultValue={isEditMode ? event?.address?.street : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Complemento'
                                        type='text'
                                        {...register('address.complement')}
                                        defaultValue={isEditMode ? event?.address?.complement : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label='Número da residência'
                                        type='text'
                                        {...register('address.number')}
                                        defaultValue={isEditMode ? event?.address?.number : ''}
                                        variant='outlined'
                                        fullWidth />
                                </Grid>
                            </>
                        )
                    }

                    <Grid item xs={12} sx={{ marginTop: '2rem' }}>
                        <Button type='submit' variant='contained' color="success" fullWidth size='large' disabled={isLoading || image === '' || dateError === 'minDate'}>
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

export default EventUpdate;
