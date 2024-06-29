import { ChevronRight } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Avatar, Box, Button, CircularProgress, FormControl, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import PatinhasLogo from '../../../assets/images/patinhas-carentes.png';
import { baseApi } from '../../../lib/api';
import useAuthStore from '../../../shared/store/authStore';

function Login() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore((state) => ({
    signIn: state.setLoginInfo,
  }));
  const { logged } = useAuthStore((state) => ({ logged: state.setLogin }));
  const { userMe } = useAuthStore((state) => ({
    userMe: state.setUserData,
  }));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const getUserData = async () => {
    try {
      const response = await baseApi.get(`/api/auth/me`);

      if (response.status === 200) {
        userMe(response.data)
        if (response.data.type === 'INTERNAL') {
          navigate('/admin/dashboard');
        } else {
          navigate('/external');
        }

      }
    } catch (error) {
      console.error("Failed to get user data: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: AxiosResponse = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password, remember: true }
      );

      if (response.status === 200) {
        if (response.data.data.token && typeof response.data.data.token === 'string') {
          signIn(response.data.data.token)
          logged();
          getUserData();
        }
      }
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed: ", error);
    }
    setLoading(false);
  }

  return (
    <Grid container justifyContent="center" alignItems="center" marginTop={4}>
      <Grid item xs={10} sm={8} md={6} lg={4} >
        <Paper elevation={3} sx={{ padding: '40px', borderRadius: '20px' }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={PatinhasLogo} sx={{ width: '180px', height: '180px', marginBottom: '48px' }} />
            <form onSubmit={handleSubmit} >
              <FormControl fullWidth margin="normal">
                <TextField
                  variant="outlined"
                  color="secondary"
                  required
                  id="email"
                  label="E-mail"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    'fieldset': { borderRadius: '6px' },
                  }}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  variant="outlined"
                  required
                  id="password"
                  label="Senha"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  sx={{
                    'fieldset': { borderRadius: '6px' },
                  }}
                />
              </FormControl>
              {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}
              <Grid item sx={{ marginTop: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/register')}
                  sx={{ marginRight: 2, padding: '8px 16px' }}
                >
                  <Typography sx={{ fontSize: '.8125rem' }}>Criar conta</Typography>
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={loading}
                  startIcon={!loading && <ChevronRight fontSize='small' color='primary' />}
                  sx={{ padding: '8px 16px' }}
                >
                  {loading ?
                    <CircularProgress size={24} />
                    :
                    <Typography sx={{ fontSize: '.8125rem', color: 'primary.main' }}>Entrar</Typography>
                  }
                </Button>
              </Grid>
            </form>
            <Grid item sx={{ marginTop: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={() => navigate('/forgot-password')}
                sx={{ textDecoration: 'underline', textTransform: 'initial', color: 'common.black' }}
              >
                <Typography sx={{ fontSize: '.8125rem' }}>Esqueci minha senha</Typography>
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Login;
