import { Person } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Avatar, Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../shared/store/authStore';
import { getToken } from '../../shared/utils/getToken';

interface LoginResponse {
  data: {
    token: string;
  }
}

function Login() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authenticate } = useUserStore((state) => state);
  const setNameStored = useUserStore((state) => state.setNameStored);
  const setEmailStored = useUserStore((state) => state.setEmailStored);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const getUserData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setNameStored(response.data.person.name);
      setEmailStored(response.data.person.email);
    } catch (error) {
      console.error("Failed to get user data: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post<LoginResponse>(
        `${apiUrl}/api/auth/login`,
        { email, password }
      );
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      getUserData();
      authenticate();
      navigate('/dashboard');
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed: ", error);
    }
    setLoading(false);
  }

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: "90vh", backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ width: '120px', height: '120px', marginBottom: '12px' }}>
            <Person />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom color="primary" >
            Sign in
          </Typography>
          <form onSubmit={handleSubmit} >
            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                color="secondary"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                label="Password"
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
              />
              <FormControlLabel control={<Checkbox />} label="Lembrar meu login" sx={{ color: '#000000' }} />
            </FormControl>
            {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Login;
