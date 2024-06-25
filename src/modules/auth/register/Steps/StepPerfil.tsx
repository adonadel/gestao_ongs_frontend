import { InputBaseComponentProps, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { TextMaskCpfCnpj } from '../../../../shared/utils/masks';
import { ExternalUser } from '../../../admin/usersManagement/types';

export default function StepPerfil() {
    const { register, formState } = useFormContext<ExternalUser>();

    return (
        <>
            <TextField
                type="hidden"
                {...register('id')}
                defaultValue={''}
                sx={{ display: 'none' }} />
            <TextField
                fullWidth
                margin='normal'
                required
                label="Nome"
                {...register('person.name')} />
            <TextField
                fullWidth
                margin='normal'
                required
                label="CPF/CNPJ"
                type='text'
                {...register('person.cpf_cnpj')}
                InputProps={{
                    inputComponent: TextMaskCpfCnpj as unknown as React.ElementType<InputBaseComponentProps>,
                }} />
            <TextField
                fullWidth
                margin='normal'
                required
                label="Email"
                {...register('person.email', { required: 'E-mail necessário', pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i, message: 'E-mail inválido' } })}
                error={!!formState.errors.person?.email}
                helperText={formState.errors.person?.email?.message}
                type="email" />
        </>
    );
}
