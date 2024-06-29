import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ExternalUser } from "../../../admin/usersManagement/types";

export default function StepUser() {
    const { register, formState, watch } = useFormContext<ExternalUser>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password');

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <TextField
                label='Senha'
                type={showPassword ? "text" : "password"}
                {...register('password', {
                    required: 'Senha necessária', 
                    minLength: { value: 6, message: 'Senha deve ter no mínimo 6 caracteres' }, 
                    pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?\\/]{6,}$/,
                        message: 'Senha deve ter no mínimo 6 caracteres, com pelo menos uma letra maiúscula, uma minúscula e números'
                    }
                })}
                error={!!formState.errors.password}
                helperText={formState.errors.password?.message}
                variant='outlined'
                fullWidth
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
            />
            <TextField
                label='Confirme a Senha'
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirm_password', {
                    required: 'Confirmação de senha necessária',
                    validate: value =>
                        value === password || 'As senhas não correspondem'
                })}
                error={!!formState.errors.confirm_password}
                helperText={formState.errors.confirm_password?.message}
                variant='outlined'
                fullWidth
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={{ mt: 2 }}
            />
        </>
    );
}
