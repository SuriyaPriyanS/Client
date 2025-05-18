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
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { registerUser } from '../Services/api';

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
   
    try {
     
      const formData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
      };

     
      if (!formData.name || !formData.email || !formData.password) {
        toast.error('All fields are required');
        return;
      }

     

     
      const result = await registerUser(formData);
      // console.log('API response:', result); // Debug log

      toast.success('Registration successful! Redirecting to login...');

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500); // Delay matches Login component
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An error occurred. Please try again.';
      if (errorMessage.includes('email already exists')) {
        toast.error('This email is already registered. Please use a different email.');
      } else if (errorMessage.includes('network')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        // Background image with overlay
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://source.unsplash.com/random/1920x1080?abstract')`, // Placeholder background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: { xs: 2, sm: 3, md: 4, lg: 6 },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: '400px', md: '450px', lg: '500px' },
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          margin: 'auto',
          background: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white for contrast
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Decorative Image */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 2, sm: 3 },
          }}
        >
          {/* <img
            src="https://via.placeholder.com/150?text=MyBlog+Logo" // Placeholder image
            alt="MyBlog Logo"
            style={{
              width: { xs: '100px', sm: '120px' },
              height: { xs: '100px', sm: '120px' },
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #7f1d1d',
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Logo'; // Fallback image
            }}
          /> */}
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#7f1d1d',
            mb: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' },
          }}
        >
          Register
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#6b7280',
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
          }}
        >
          Create your account to start blogging
        </Typography>

        <Divider sx={{ mb: { xs: 2, sm: 3 }, borderColor: '#e5e7eb' }} />

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%' }}
        >
          {/* Username Field */}
          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Username"
              variant="outlined"
              autoComplete="username"
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: errors.name ? 'error.main' : '#7f1d1d' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7f1d1d',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7f1d1d',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280',
                  '&.Mui-focused': {
                    color: '#7f1d1d',
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                },
              }}
              {...register('name', {
                required: 'Username is required',
                minLength: {
                  value: 2,
                  message: 'Username must be at least 2 characters',
                },
                maxLength: {
                  value: 50,
                  message: 'Username must be less than 50 characters',
                },
              })}
            />
          </Box>

          {/* Email Field */}
          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <TextField
              fullWidth
              id="email"
              name="email"
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7f1d1d',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7f1d1d',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280',
                  '&.Mui-focused': {
                    color: '#7f1d1d',
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                },
              }}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              autoComplete="new-password"
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7f1d1d',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7f1d1d',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280',
                  '&.Mui-focused': {
                    color: '#7f1d1d',
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                },
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters ',
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain at least one letter and one number and Capital letter',
                },
              })}
            />
          </Box>

          {/* Register Button */}
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
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Register'
            )}
          </Button>

          {/* Sign In Link */}
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#6b7280',
              mt: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
            }}
          >
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                color: '#7f1d1d',
                fontWeight: 'bold',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Sign in
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
          style={{ zIndex: 9999 }}
        />
      </Paper>
    </Box>
  );
};

export default Register;