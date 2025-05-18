import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  ArrowBack as ArrowBackIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { fetchBlogById, deleteBlog } from '../Services/api';

const BlogDeleted = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  
  // States
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!isLoggedIn) {
        toast.error('Please log in to delete blogs');
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
          setError('You can only delete your own blogs');
          toast.error('You can only delete your own blogs');
          setTimeout(() => navigate('/'), 3000);
          return;
        }
        
        setBlog(blogData);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.message || 'Failed to fetch blog data');
        toast.error(error.message || 'Failed to fetch blog data');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogData();
  }, [blogId, isLoggedIn, navigate]);
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setConfirmDialogOpen(true);
  };
  
  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
  };
  
  // Handle actual deletion
  const handleDeleteBlog = async () => {
    setIsDeleting(true);
    
    try {
      await deleteBlog(blogId);
      setConfirmDialogOpen(false);
      toast.success('Blog deleted successfully');
      
      // Redirect to profile or home page after successful deletion
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog');
      setConfirmDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle go back
  const handleGoBack = () => {
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
  
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mt: 2,
            backgroundColor: '#7f1d1d',
            '&:hover': { backgroundColor: '#991b1b' },
          }}
        >
          Go to Home
        </Button>
        <ToastContainer />
      </Box>
    );
  }
  
  if (!blog) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Blog not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mt: 2,
            backgroundColor: '#7f1d1d',
            '&:hover': { backgroundColor: '#991b1b' },
          }}
        >
          Go to Home
        </Button>
        <ToastContainer />
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
            <DeleteIcon /> Delete Blog
          </Typography>
          
          <Box
            sx={{
              p: 2,
              border: '1px solid #fee2e2',
              borderRadius: 1,
              backgroundColor: '#fef2f2',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <WarningIcon sx={{ color: '#dc2626', fontSize: 40 }} />
            <Typography variant="body1" color="#b91c1c">
              Warning: This action cannot be undone. Once deleted, all blog content will be permanently removed.
            </Typography>
          </Box>
          
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: '#4b5563',
              fontWeight: 'bold',
            }}
          >
            Blog to be deleted:
          </Typography>
          
          <Card sx={{ mb: 4 }}>
            {blog.image && (
              <CardMedia
                component="img"
                height="200"
                image={blog.image}
                alt={blog.title}
                sx={{ objectFit: 'cover' }}
              />
            )}
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={blog.category} 
                  size="small" 
                  sx={{ 
                    backgroundColor: '#7f1d1d', 
                    color: 'white' 
                  }} 
                />
                <Typography variant="body2" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {blog.title}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {blog.content.substring(0, 200)}
                {blog.content.length > 200 ? '...' : ''}
              </Typography>
            </CardContent>
          </Card>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                color: '#4b5563',
                borderColor: '#4b5563',
                '&:hover': { borderColor: '#374151', backgroundColor: 'rgba(75, 85, 99, 0.04)' },
              }}
            >
              Go Back
            </Button>
            
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: '#dc2626',
                '&:hover': { backgroundColor: '#b91c1c' },
              }}
            >
              Delete Blog
            </Button>
          </Box>
        </Paper>
        
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ color: '#dc2626' }}>
            {"Confirm Blog Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you absolutely sure you want to delete "{blog.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleDeleteCancel} 
              sx={{ color: '#4b5563' }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteBlog} 
              color="error" 
              variant="contained"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              autoFocus
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
        
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

export default BlogDeleted;
