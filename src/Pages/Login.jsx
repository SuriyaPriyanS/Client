import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { loginUser } from '../Services/api';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      // Call the login API
      const response = await loginUser(data);

      // Store user data in localStorage for persistence across page refreshes
      const storeUserData = () => {
        return new Promise((resolve) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }

          // Store user information in localStorage
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          } else if (response.userData) {
            localStorage.setItem('user', JSON.stringify(response.userData));
          } else if (response.data && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          resolve();
        });
      };

      // Ensure localStorage updates are completed before redirecting
      await storeUserData();

      // Show success message
      toast.success('Login successful! Redirecting to profile...');

      // Redirect to profile page after a slight delay to ensure state synchronization
      setTimeout(() => {
        navigate('/profile', { replace: true });
      }, 1500); // Increased delay to 1.5 seconds to avoid race conditions
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#7f1d1d',
            mb: 1,
            fontWeight: 'bold',
          }}
        >
          Login
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#6b7280',
            mb: 3,
          }}
        >
          Sign in to your account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 2 }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: errors.email ? 'error.main' : '#7f1d1d' }} />
                  </InputAdornment>
                ),
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Invalid email address',
                },
              })}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: errors.password ? 'error.main' : '#7f1d1d' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {/* <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              sx={{
                color: '#6b7280',
                '&:hover': {
                  color: '#7f1d1d',
                  textDecoration: 'underline',
                },
                fontSize: '0.875rem',
              }}
            >
              Forgot password?
            </Link> */}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#7f1d1d',
              '&:hover': {
                backgroundColor: '#991b1b',
              },
              py: 1.5,
              borderRadius: 1,
              transition: 'background-color 0.2s',
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Log In'
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#6b7280',
              mt: 2,
            }}
          >
            New on our platform?{' '}
            <Link
              component={RouterLink}
              to="/signup"
              sx={{
                color: '#7f1d1d',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              signup
            </Link>
          </Typography>
        </Box>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Paper>
    </Box>
  );
};

export default Login;