import { Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { baseApi } from '../../../lib/api';
import AutoComplete from "../../../shared/components/autoComplete/AutoComplete.tsx";
import { Loading } from '../../../shared/components/loading/Loading';
import { Message } from '../../../shared/components/message/Message';
import { Adoption } from './types';

const AdoptionsUpdate: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [adoption, setAdoption] = useState<Adoption | null>(null);
	const isEditMode = !!id;
	const { register, handleSubmit, setValue } = useForm<Adoption>();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedAnimalId, setSelectedAnimalId] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);

	const handleClose = () => {
		setOpenMessage(false);
	}

	const [textMessage, setTextMessage] = useState('Mensagem padrão');
	const [typeMessage, setTypeMessage] = useState('warning');
	const [openMessage, setOpenMessage] = useState(false);

	useEffect(() => {
		if (isEditMode) {
			const fetchAdoption = async () => {
				try {
					const response = await baseApi.get(`/api/adoptions/${id}`);

					const adoption = response.data;
					setValue('user_id', adoption.user_id);
					setValue('animal_id', adoption.animal_id);
					setAdoption(adoption);
				} catch (error) {
					setTextMessage('Ocorreu um erro ao acessar essa página!');
					setTypeMessage('error');
					setOpenMessage(true);
				}
			};
			fetchAdoption();
		}
	}, [id, isEditMode, navigate]);

	const onSubmit = async (data: Adoption) => {
		try {
			if (isEditMode) {
				await baseApi.put(`/api/adoptions/${id}`, data);
			} else {
				await baseApi.post(`/api/adoptions`, data);
			}
			navigate('/admin/adoptions');
		} catch (error) {
			setTextMessage('Ocorreu um erro ao salvar a adoção!');
			setTypeMessage('error');
			setOpenMessage(true);
		}
	};

	useEffect(() => {
		setValue('user_id', selectedUserId)
	}, [selectedUserId]);

	useEffect(() => {
		setValue('animal_id', selectedAnimalId)
	}, [selectedAnimalId]);

	if (isEditMode && !adoption) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Typography variant="h3" fontSize={'2rem'} marginTop='20px' fontWeight={'medium'}>{isEditMode ? 'Editar' : 'Criar'} adoção</Typography>
			<Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px', marginTop: '10px', maxWidth: '650px' }}>
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
					<Grid container alignItems="center" spacing={2}>
						<Grid item xs={12}>
							<TextField
								label="Descrição"
								multiline minRows={4} maxRows={6}
								type="text"
								{...register('description')}
								defaultValue={isEditMode ? adoption?.description : ''}
							/>
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
							<Divider />
						</Grid>

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
			</Paper>
		</>
	);
};

export default AdoptionsUpdate;