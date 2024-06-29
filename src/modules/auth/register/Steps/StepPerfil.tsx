import { InputBaseComponentProps, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { TextMaskCpfCnpj } from '../../../../shared/utils/masks';
import { ExternalUser } from '../../../admin/usersManagement/types';
import { isValidCNPJ, isValidCPF } from '../../../../shared/utils/validate';

export default function StepPerfil() {
    const { register, formState, control } = useFormContext<ExternalUser>();

    const isValidCPFOrCNPJ = (input: string): boolean => {
        const cleanedInput = input.replace(/[^\d]+/g, '');
        if (cleanedInput.length === 11) {
            return isValidCPF(cleanedInput);
        } else if (cleanedInput.length === 14) {
            return isValidCNPJ(cleanedInput);
        }
        return false;
    };

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
            <Controller
                name="person.cpf_cnpj"
                control={control}
                rules={{
                    required: "CPF/CNPJ obrigatório",
                    validate: value => isValidCPFOrCNPJ(value) || "CPF/CNPJ inválido"
                }}
                render={({ field }) => (
                    <TextField
                    {...field}
                    label="CPF/CNPJ"
                    type='text'
                    fullWidth
                        margin='normal'
                        {...register('person.cpf_cnpj')}
                        defaultValue={''}
                        required
                        InputProps={{
                            inputComponent: TextMaskCpfCnpj as unknown as React.ElementType<InputBaseComponentProps>,
                        }}
                        error={!!formState.errors.person?.cpf_cnpj}
                        helperText={formState.errors.person?.cpf_cnpj?.message}
                    />
                )}
            />
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
