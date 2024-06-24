import { Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { baseApi } from '../../../lib/api';
import AutoComplete from "../../../shared/components/autoComplete/AutoComplete.tsx";
import FullLoader from '../../../shared/components/loading/FullLoader.tsx';
import { Loading } from '../../../shared/components/loading/Loading';
import { Message } from '../../../shared/components/message/Message';
import useAuthStore from '../../../shared/store/authStore.ts';
import { Financial } from './types';

const FinancialUpdate: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [finance, setFinance] = useState<Financial | null>(null);
	const isEditMode = !!id;
	const { register, handleSubmit, setValue } = useForm<Financial>();
	const [isLoading, setIsLoading] = useState(false);
	const [dateError, setDateError] = useState('');
	const [formattedMoney, setFormattedMoney] = useState('');
	const [money, setMoney] = useState(0);
	const [selectedAnimalId, setSelectedAnimalId] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const isTokenRefreshed = useRef(false);
	const { user, setToken } = useAuthStore(state => ({
		user: state.userData,
		setToken: state.setToken
	}));

	const handleClose = () => {
		setOpenMessage(false);
	}

	const [textMessage, setTextMessage] = useState('Mensagem padrão');
	const [typeMessage, setTypeMessage] = useState('warning');
	const [openMessage, setOpenMessage] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		if (isEditMode) {
			const fetchFinancial = async () => {
				try {
					const response = await baseApi.get(`/api/finances/${id}`);

					const finance = response.data;
					const formatted = formatDate(finance.date, true);
					finance.date = formatted;
					setSelectedDate(dayjs(formatted, 'DD/MM/YYYY'));
					setValue('value', money);
					setValue('user_id', finance.user_id);
					setValue('animal_id', finance.animal_id);
					setFormattedMoney(finance.value.replace('.', ','));
					setFinance(finance);
				} catch (error: any) {
					if (error?.response?.status === 401 && !!user && !isTokenRefreshed.current) {
						console.log("Refreshing token...");
						try {
							isTokenRefreshed.current = true;
							const responseRefreshToken: AxiosResponse = await baseApi.post(`/api/auth/refresh`);
							const refreshToken = responseRefreshToken.data.newToken;
							setToken(refreshToken);
							fetchFinancial();
						} catch (error) {
							navigate('/login');
						}
					} else {
						console.error("Failed to fetch users:", error);
					}
				} finally {
					setIsLoading(false);
				}
			};
			fetchFinancial();
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

	const onSubmit = async (data: Financial) => {
		try {
			const date = formatDate(data.date);
			data.date = date;

			if (isEditMode) {
				await baseApi.put(`/api/finances/${id}`, data);
			} else {
				data.status = 'PAID';
				await baseApi.post(`/api/finances`, data);
			}
			navigate('/admin/financial');
		} catch (error: any) {
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
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const cleaned = formattedMoney.replace(/[^0-9\,]/g, '');
		const parts = cleaned.split(',');
		const integerPart = parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		let decimalPart = '';
		let onlyComma = false;

		if (parts.length > 1) {
			decimalPart = parts[1].slice(0, 2);
			if (decimalPart.length === 0) {
				onlyComma = true;
			}
		}

		const formatted = `${integerPart}${decimalPart || onlyComma ? `,${decimalPart}` : ''}`;

		setMoney(cleaned.replace(',', '.'));
		setFormattedMoney(formatted)
	}, [formattedMoney]);

	useEffect(() => {
		setValue('value', money);
	}, [money]);

	useEffect(() => {
		setValue('user_id', selectedUserId)
	}, [selectedUserId]);

	useEffect(() => {
		setValue('animal_id', selectedAnimalId)
	}, [selectedAnimalId]);

	if (isEditMode && !finance) {
		return <FullLoader />;
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<TextField
					type="hidden"
					{...register('user_id')}
					sx={{ display: 'none' }}
				/>
				<TextField
					type="hidden"
					{...register('animal_id')}
					sx={{ display: 'none' }}
				/>
				<TextField
					type="hidden"
					{...register('value')}
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


					<Grid item xs={12}>
						<FormControl fullWidth>
							<InputLabel id="type-label">Tipo da finança</InputLabel>
							<Select
								labelId="type-label"
								label="Tipo da finança"
								id="type"
								{...register('type', { required: 'Tipo é necessário' })}
								defaultValue={isEditMode ? finance?.type : ''}
							>
								<MenuItem value="" disabled>
									Selecione o tipo de finança
								</MenuItem>
								<MenuItem value="EXPENSE">Despesa</MenuItem>
								<MenuItem value="INCOME">Entrada</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Descrição"
							multiline minRows={4} maxRows={6}
							type="text"
							{...register('description')}
							defaultValue={isEditMode ? finance?.description : ''}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<TextField
								id="outlined-adornment-amount"
								label="Valor"
								InputProps={{
									startAdornment: <InputAdornment position="start">R$</InputAdornment>, // Add currency symbol as endAdornment
								}}
								value={formattedMoney}
								onChange={(e) => setFormattedMoney(e.target.value)}
							/>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<AutoComplete
							origin='users'
							objectToGetName='person'
							objectToGetId=''
							labelForAutoComplete='Usuário'
							onChange={(id) => {
								setSelectedUserId(id);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<AutoComplete
							origin='animals'
							objectToGetName=''
							objectToGetId=''
							labelForAutoComplete='Animal'
							onChange={(id) => {
								setSelectedAnimalId(id);
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<LocalizationProvider dateAdapter={AdapterDayjs} >
							<DatePicker
								label='Data da finança'
								value={selectedDate}
								format='DD/MM/YYYY'
								onChange={(date) => {
									if (date) {
										const formattedDate = date.format('DD/MM/YYYY');
										setSelectedDate(date);
										setValue('date', formattedDate);
									} else {
										setSelectedDate(null);
									}
								}}
								slotProps={{
									textField: {
										...register('date'),
										error: dateError && dateError === 'minDate' ? true : undefined,
										helperText: dateError && dateError === 'minDate' ? 'Informe uma data maior ou igual à hoje' : ''
									}
								}}
								minDate={dayjs(new Date())}
							/>
						</LocalizationProvider>
					</Grid>
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

export default FinancialUpdate;
