import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { fetchBlogById, updateBlog } from '../Services/api';

const BlogEdited = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: ''
  });
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  
  // Image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // Categories
  const categories = ['Career', 'Finance', 'Travel'];
  
  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!isLoggedIn) {
        toast.error('Please log in to edit blogs');
        navigate('/login');
        return;
      }
      
      if (!blogId) {
        toast.error('Blog ID is missing');
        navigate('/');
        return;
      }
      
      try {
        setIsLoading(true);
        const blogData = await fetchBlogById(blogId);
        
        // Check if the user is the author of the blog
        // This assumes your API returns user information with the blog
        // Adjust according to your actual API response
        if (blogData.userId !== localStorage.getItem('userId')) {
          toast.error('You can only edit your own blogs');
          navigate('/');
          return;
        }
        
        setFormData({
          title: blogData.title || '',
          category: blogData.category || '',
          content: blogData.content || '',
          image: blogData.image || ''
        });
        
        if (blogData.image) {
          setImagePreview(blogData.image);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error(error.message || 'Failed to fetch blog data');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogData();
  }, [blogId, isLoggedIn, navigate]);
  
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
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
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Content validation
    if (!formData.content) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }
    
    // Image validation (optional field but must be valid URL if provided)
    if (formData.image && !formData.image.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i)) {
      newErrors.image = 'Please enter a valid image URL (e.g., https://example.com/image.jpg)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast.error('Please log in to edit blogs');
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
      // console.log('Updating blog data:', formData);
      const response = await updateBlog(blogId, formData);
      toast.success(`Blog "${response.blog?.title || formData.title}" updated successfully!`);
      
      // Redirect to blog detail page after successful update
      setTimeout(() => {
        navigate(`/blog/${blogId}`);
      }, 2000);
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error?.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle image error
  const handleImageError = () => {
    setImagePreview(null);
    if (!errors.image) {
      setErrors(prev => ({
        ...prev,
        image: 'Invalid image URL. The image could not be loaded.'
      }));
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    navigate(`/blog/${blogId}`);
  };
  
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#7f1d1d' }} />
      </Box>
    );
  }
  
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
            <SaveIcon /> Edit Blog
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                <ImageIcon sx={{ mr: 1, color: '#7f1d1d' }} /> Blog Image URL
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
                    disabled={isSubmitting}
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
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleCancel}
                  startIcon={<ArrowBackIcon />}
                  disabled={isSubmitting}
                  sx={{
                    color: '#4b5563',
                    borderColor: '#4b5563',
                    '&:hover': { borderColor: '#374151', backgroundColor: 'rgba(75, 85, 99, 0.04)' },
                    py: 1.5,
                    borderRadius: 1,
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? null : <SaveIcon />}
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </Grid>
            </Grid>
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

export default BlogEdited;
