import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Title as TitleIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { createdBlog } from '../Services/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    userId: '',
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Categories
  const categories = ['Career', 'Finance', 'Travel'];

  // Check if form is disabled
  const isDisabled = !isLoggedIn || isSubmitting;

  // Update image preview when image URL changes
  useEffect(() => {
    if (formData.image && formData.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i)) {
      setImagePreview(formData.image);
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!categories.includes(formData.category)) {
      newErrors.category = 'Invalid category';
    }

    // Content validation
    if (!formData.content) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content must be less than 10,000 characters';
    }

    // Image validation
    if (formData.image && !formData.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i)) {
      newErrors.image = 'Invalid image URL (must be a valid PNG, JPG, JPEG, GIF, SVG, or WEBP URL)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);
    const userId = decodedToken.id;
    console.log(userId , 'user id');
    setFormData((prev) => ({
      ...prev,
      userId,
    }));


    // const decoded = decodeToken(token);

    if (!isLoggedIn) {
      toast.error('Please log in to create a blog');
      navigate('/login');
      return;
    }

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting blog data:', formData);

      const response = await createdBlog(formData);
      toast.success(`Blog "${response.blog?.title || formData.title}" created successfully!`);

      // Redirect to home page after successful creation
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error creating blog:', error);
      const message = error.response?.data?.message || 'Failed to create blog';
      toast.error(message);
      if (message.includes('token') || message.includes('user not found')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image error
  const handleImageError = () => {
    setImagePreview(null);
    if (!errors.image) {
      setErrors((prev) => ({
        ...prev,
        image: 'Failed to load image. Please check the URL.',
      }));
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f3f4f6',
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            backgroundColor: '#fff',
            mt: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              color: '#7f1d1d',
              mb: 3,
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <CreateIcon /> Create a New Blog
          </Typography>

          {!isLoggedIn && (
            <>
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: '#7f1d1d',
                  mb: 2,
                  fontStyle: 'italic',
                }}
              >
                Please log in to create a blog.
              </Typography>
              <ToastContainer
                open={!isLoggedIn}
                message="Please log in to create a blog"
                severity="warning"
                onClose={() => {}}
              />
            </>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mb: 3 }}
              disabled={isDisabled}
              InputProps={{
                startAdornment: <TitleIcon sx={{ mr: 1, color: '#7f1d1d' }} />,
              }}
            />

            <TextField
              fullWidth
              id="category"
              name="category"
              select
              label="Category"
              variant="outlined"
              value={formData.category}
              onChange={handleInputChange}
              error={!!errors.category}
              helperText={errors.category}
              sx={{ mb: 3 }}
              disabled={isDisabled}
              InputProps={{
                startAdornment: <CategoryIcon sx={{ mr: 1, color: '#7f1d1d' }} />,
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              id="content"
              name="content"
              label="Content"
              variant="outlined"
              value={formData.content}
              onChange={handleInputChange}
              error={!!errors.content}
              helperText={errors.content}
              multiline
              rows={6}
              sx={{ mb: 3 }}
              disabled={isDisabled}
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: '#7f1d1d' }} />,
              }}
            />

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  color: '#4b5563',
                }}
              >
                <ImageIcon sx={{ mr: 1, color: '#7f1d1d' }} /> Blog Image URL (Optional)
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={imagePreview ? 6 : 12}>
                  <TextField
                    fullWidth
                    id="image"
                    name="image"
                    label="Image URL"
                    variant="outlined"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    error={!!errors.image}
                    helperText={errors.image}
                    disabled={isDisabled}
                    InputProps={{
                      startAdornment: <ImageIcon sx={{ mr: 1, color: '#7f1d1d' }} />,
                    }}
                  />
                </Grid>

                {imagePreview && (
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '150px',
                        borderRadius: 1,
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={handleImageError}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isDisabled}
              startIcon={isSubmitting ? null : <CreateIcon />}
              sx={{
                backgroundColor: '#7f1d1d',
                '&:hover': { backgroundColor: '#991b1b' },
                py: 1.5,
                borderRadius: 1,
                transition: 'background-color 0.2s',
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  Creating...
                </>
              ) : (
                'Create Blog'
              )}
            </Button>
          </Box>
        </Paper>

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
      </Container>
    </Box>
  );
};

export default CreateBlog;