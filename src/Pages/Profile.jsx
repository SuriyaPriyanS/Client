import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Image as ImageIcon,
  Cancel as CancelIcon,
  Logout as LogoutIcon,
  Article as ArticleIcon,
  Visibility as VisibilityIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { getUserProfile, updateUserProfile, deleteUserAccount, fetchBlogById, updateBlog, deleteBlog } from '../Services/api';
import { jwtDecode } from 'jwt-decode';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [userBlogs, setUserBlogs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editBlogId, setEditBlogId] = useState(null);
  const [editBlogData, setEditBlogData] = useState({ title: '', category: '', content: '', image: '' });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState(null);
  const [deleteBlogDialogOpen, setDeleteBlogDialogOpen] = useState(false);
  const [profile, setProfile] = useState({
    userName: '',
    email: '',
    profileImage: '',
  });
  const [formData, setFormData] = useState({
    userName: '',
    profileImage: '',
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setProfile(userData);
        setFormData({
          userName: userData.userName || '',
          profileImage: userData.profileImage || '',
        });
        setImagePreview(userData.profileImage || null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(error.message || 'Failed to load profile');
        if (error.message?.includes('token') || error.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [isLoggedIn, navigate]);

  const fetchUserBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const id = decoded.id;
      const blogData = await fetchBlogById(id);
      const blogs = blogData?.blog;
      setUserBlogs(Array.isArray(blogs) ? blogs : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error(error.message || 'Failed to fetch blogs');
      setUserBlogs([]);
    }
  };

  useEffect(() => {
    if (tabValue === 1) {
      fetchUserBlogs();
    }
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (name === 'profileImage') {
      setImagePreview(value.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i) ? value : null);
    }
  };

  const handleEditBlogChange = (e) => {
    const { name, value } = e.target;
    setEditBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 2) {
      newErrors.userName = 'Username must be at least 2 characters';
    } else if (formData.userName.length > 50) {
      newErrors.userName = 'Username must be less than 50 characters';
    }
    if (formData.profileImage && !formData.profileImage.match(/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i)) {
      newErrors.profileImage = 'Invalid image URL (must be PNG, JPG, JPEG, GIF, SVG, or WEBP)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEditBlogForm = () => {
    const newErrors = {};
    if (!editBlogData.title) {
      newErrors.title = 'Title is required';
    }
    if (!editBlogData.category) {
      newErrors.category = 'Category is required';
    }
    if (!editBlogData.content) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditBlogId(blog._id);
    setEditBlogData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: blog.image,
      
    });
    setEditDialogOpen(true);
  };

  const handleSaveEditBlog = async () => {
    const isValid = validateEditBlogForm();
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateBlog(editBlogId, editBlogData);
      await fetchUserBlogs(); // Refresh blogs after edit
      setEditDialogOpen(false);
      toast.success('Blog updated successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error(error.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async () => {
    setIsSubmitting(true);
    try {
      await deleteBlog(deleteBlogId);
      await fetchUserBlogs(); // Refresh blogs after delete
      setDeleteBlogDialogOpen(false);
      toast.success('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error(error.message || 'Failed to delete blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    try {
      await deleteUserAccount();
      toast.success('Account deleted successfully');
      localStorage.removeItem('token');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const handleImageError = () => {
    setImagePreview(null);
    setErrors((prev) => ({
      ...prev,
      profileImage: 'Failed to load image. Please check the URL.',
    }));
  };

  const navigateToBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '';
  };

  const categories = [...new Set(userBlogs.map((blog) => blog.category))];

  // Filter and sort blogs directly in render
  const displayedBlogs = userBlogs
    .filter((blog) => {
      const matchesCategory = categoryFilter ? blog.category === categoryFilter : true;
      const matchesTitle = titleFilter
        ? blog.title.toLowerCase().includes(titleFilter.toLowerCase())
        : true;
      return matchesCategory && matchesTitle;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} sx={{ color: '#7f1d1d' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#f3f4f6', padding: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ borderRadius: 2, backgroundColor: '#fff', mt: 4, overflow: 'hidden' }}>
          {/* Profile Header */}
          <Box
            sx={{
              backgroundColor: '#7f1d1d',
              color: 'white',
              p: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              src={profile.profileImage}
              alt={profile.name}
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                border: '3px solid white',
              }}
            >
              {profile.name?.charAt(0).toUpperCase() || <PersonIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {profile.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {profile.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
              {!editMode ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                  sx={{
                    backgroundColor: 'white',
                    color: '#7f1d1d',
                    '&:hover': { backgroundColor: '#f3f4f6' },
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      userName: profile.userName || '',
                      profileImage: profile.profileImage || '',
                    });
                    setImagePreview(profile.profileImage || null);
                    setErrors({});
                  }}
                  sx={{
                    backgroundColor: 'white',
                    color: '#7f1d1d',
                    '&:hover': { backgroundColor: '#f3f4f6' },
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: '#f3f4f6', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              centered
              sx={{
                '& .MuiTab-root': { fontWeight: 'bold' },
                '& .Mui-selected': { color: '#7f1d1d' },
                '& .MuiTabs-indicator': { backgroundColor: '#7f1d1d' },
              }}
            >
              <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="My Blog" icon={<PersonIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            {editMode ? (
              <Box component="form" noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#4b5563', fontWeight: 'bold' }}>
                      Edit Your Profile
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="userName"
                      name="name"
                      label="Username"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={!!errors.userName}
                      helperText={errors.userName}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: '#7f1d1d' }} />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      value={profile.email}
                      disabled
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#7f1d1d' }} />,
                      }}
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={imagePreview ? 6 : 12}>
                    <TextField
                      fullWidth
                      id="profileImage"
                      name="profileImage"
                      label="Profile Image URL"
                      variant="outlined"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      error={!!errors.profileImage}
                      helperText={errors.profileImage}
                      placeholder="https://example.com/image.jpg"
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
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
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                      onClick={handleSaveProfile}
                      disabled={isSubmitting}
                      sx={{
                        backgroundColor: '#7f1d1d',
                        '&:hover': { backgroundColor: '#991b1b' },
                        mr: 2,
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#4b5563', fontWeight: 'bold' }}>
                      Profile Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#6b7280', mb: 1 }}>
                        Username
                      </Typography>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: '#7f1d1d' }} />
                        {profile.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ color: '#6b7280', mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, color: '#7f1d1d' }} />
                        {profile.email}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: '#4b5563', fontWeight: 'bold' }}>
                      Account Management
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{ mt: 1 }}
                    >
                      Delete Account
                    </Button>
                    <Typography variant="body2" sx={{ mt: 1, color: '#6b7280' }}>
                      Warning: This action cannot be undone. All your data will be permanently deleted.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>            )}
          </TabPanel>

          {/* My Blogs Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" sx={{ mb: 3, color: '#4b5563', fontWeight: 'bold' }}>
              My Published Blogs
            </Typography>
            {/* Filter and Sort Section */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Search by Title"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                variant="outlined"
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                sx={{ height: 'fit-content' }}
              >
                Sort by Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
              </Button>
            </Box>
            {displayedBlogs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ArticleIcon sx={{ fontSize: 60, color: '#d1d5db' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#6b7280' }}>
                  {userBlogs.length === 0
                    ? "You haven't published any blogs yet"
                    : "No blogs match your filter"}
                </Typography>
                {userBlogs.length === 0 && (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/create')}
                    sx={{
                      mt: 2,
                      backgroundColor: '#7f1d1d',
                      '&:hover': { backgroundColor: '#991b1b' },
                    }}
                  >
                    Create Your First Blog
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {displayedBlogs.map((blog) => (
                  <Grid item xs={12} sm={6} md={4} key={blog._id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={blog.image || 'https://source.unsplash.com/random?blog'}
                        alt={blog.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label={blog.category}
                          size="small"
                          sx={{
                            mb: 1,
                            backgroundColor: '#7f1d1d',
                            color: 'white',
                          }}
                        />
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                          {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {blog.content.substring(0, 100)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Created: {formatDate(blog.createdAt)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {/* <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigateToBlog(blog._id)}
                            sx={{ color: '#7f1d1d' }}
                          >
                            View
                          </Button> */}
                          <IconButton
                            onClick={() => handleEditBlog(blog)}
                            sx={{ color: '#7f1d1d' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setDeleteBlogId(blog._id);
                              setDeleteBlogDialogOpen(true);
                            }}
                            sx={{ color: '#7f1d1d' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
        </Paper>

        {/* Edit Blog Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle sx={{ color: '#7f1d1d' }}>Edit Blog</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={editBlogData.title}
              onChange={handleEditBlogChange}
              error={!!errors.title}
              helperText={errors.title}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={editBlogData.category}
                onChange={handleEditBlogChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography color="error" variant="caption">
                  {errors.category}
                </Typography>
              )}
            </FormControl>
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={editBlogData.content}
              onChange={handleEditBlogChange}
              multiline
              rows={4}
              error={!!errors.content}
              helperText={errors.content}
              sx={{ mt: 2 }}
            />
             <TextField
              fullWidth
              label="Image"
              name="image"
              value={editBlogData.image}
              onChange={handleEditBlogChange}
              multiline
              rows={4}
              error={!!errors.content}
              helperText={errors.content}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#4b5563' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditBlog}
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={isSubmitting}
              sx={{ backgroundColor: '#7f1d1d', '&:hover': { backgroundColor: '#991b1b' } }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Blog Confirmation Dialog */}
        <Dialog
          open={deleteBlogDialogOpen}
          onClose={() => setDeleteBlogDialogOpen(false)}
        >
          <DialogTitle sx={{ color: '#7f1d1d' }}>Delete Blog?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this blog? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteBlogDialogOpen(false)} sx={{ color: '#4b5563' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteBlog}
              color="error"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title" sx={{ color: '#7f1d1d' }}>
            Delete Your Account?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              This action cannot be undone. All your data, including your profile and blogs, will be permanently deleted.
              Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#4b5563' }}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
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

export default Profile;