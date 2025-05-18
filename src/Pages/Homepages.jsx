import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Container,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Pagination,
  Divider,
  Fade,
} from '@mui/material';
import {
  Person as PersonIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  CalendarToday as CalendarIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { fetchBlogs } from '../Services/api';

const Home = () => {
  const [blogsData, setBlogsData] = useState({
    blogs: [],
    totalPages: 0,
    currentPage: 1,
    totalBlogs: 0,
  });
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    author: '',
    category: '',
    searchTerm: '',
    imageUrl: '',
    page: 1,
    limit: 9,
  });
  const navigate = useNavigate();
  const categories = ['Career', 'Finance', 'Travel'];

  useEffect(() => {
    fetchBlogsData();
  }, [filters.page, filters.category, filters.author, filters.searchTerm]);

  const fetchBlogsData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.author) queryParams.append('author', filters.author);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);

      const data = await fetchBlogs(queryParams);
      setBlogsData({
        blogs: data.blogs || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
        totalBlogs: data.totalBlogs || 0,
      });

      const uniqueAuthors = [...new Set(data.blogs.map((blog) => blog.author || 'Anonymous'))];
      setAuthors(uniqueAuthors);

      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message || 'Failed to fetch blogs. Please try again.');
      setBlogsData({
        blogs: [],
        totalPages: 0,
        currentPage: 1,
        totalBlogs: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      author: '',
      category: '',
      searchTerm: '',
      imageUrl: '',
      page: 1,
      limit: 9,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://source.unsplash.com/random/1920x1080?abstract')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="xl">
        {/* Decorative Image */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* <img
            src="https://via.placeholder.com/150?text=MyBlog+Logo"
            alt="MyBlog Logo"
            style={{
              width: { xs: 80, sm: 100, md: 120, lg: 140, xl: 150 },
              height: { xs: 80, sm: 100, md: 120, lg: 140, xl: 150 },
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #7f1d1d',
            }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Logo';
            }}
          /> */}
        </Box>

        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            color: '#ffffff',
            mb: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem', xl: '2.5rem' },
            letterSpacing: 1,
          }}
        >
          Explore Blog Posts
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#d1d5db',
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.2rem' },
          }}
        >
          Discover stories, insights, and tips from our community
        </Typography>

        <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderColor: '#e5e7eb' }} />

        {/* Search Bar */}
        <Box
          sx={{
            mb: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xs: '100%', sm: '600px', md: '700px', lg: '800px', xl: '900px' },
            mx: 'auto',
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <TextField
            fullWidth
            label="Search by title or content"
            name="searchTerm"
            variant="outlined"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            sx={{
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
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
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7f1d1d', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              bgcolor: '#7f1d1d',
              '&:hover': { bgcolor: '#991b1b' },
              borderRadius: '8px',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              textTransform: 'none',
              minWidth: { xs: '100%', sm: 'auto' },
            }}
          >
            Search
          </Button>
        </Box>

        {/* Filters */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 2, md: 3 },
            mb: { xs: 3, sm: 4, md: 5 },
            maxWidth: { xs: '100%', sm: '600px', md: '800px', lg: '900px', xl: '1000px' },
            mx: 'auto',
          }}
        >
          <TextField
            select
            label="Author"
            variant="outlined"
            name="author"
            value={filters.author}
            onChange={handleFilterChange}
            fullWidth
            sx={{
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
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
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#7f1d1d', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Authors</MenuItem>
            {authors.map((author) => (
              <MenuItem key={author} value={author}>
                {author}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Category"
            variant="outlined"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            fullWidth
            sx={{
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
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
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon sx={{ color: '#7f1d1d', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Blog Image URL (Create a Blog to Add)"
            variant="outlined"
            name="imageUrl"
            value={filters.imageUrl}
            onChange={handleFilterChange}
            fullWidth
            disabled
            sx={{
              bgcolor: '#fff',
              borderRadius: '8px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280',
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon sx={{ color: '#7f1d1d', fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Filter Actions */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: { xs: 3, sm: 4, md: 5 },
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            sx={{
              borderColor: '#7f1d1d',
              color: '#7f1d1d',
              borderRadius: '8px',
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              textTransform: 'none',
              '&:hover': {
                borderColor: '#991b1b',
                backgroundColor: 'rgba(127, 29, 29, 0.04)',
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Results Count */}
        {!loading && !error && (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#d1d5db',
              mb: { xs: 2, sm: 3, md: 4 },
              fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem', xl: '1.2rem' },
            }}
          >
            Showing {blogsData.blogs.length} of {blogsData.totalBlogs} blog posts
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, sm: 4 } }}>
            <CircularProgress sx={{ color: '#7f1d1d', size: { xs: 36, sm: 40, md: 48 } }} />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: { xs: 2, sm: 3, md: 4 },
              maxWidth: { xs: '100%', sm: '600px', md: '700px', lg: '800px' },
              mx: 'auto',
              borderRadius: '8px',
              bgcolor: 'rgba(239, 83, 80, 0.1)',
              color: '#ef5350',
              '& .MuiAlert-icon': {
                color: '#ef5350',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              },
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchBlogsData}
                sx={{
                  color: '#ef5350',
                  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                  '&:hover': {
                    backgroundColor: 'rgba(239, 83, 80, 0.2)',
                  },
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!loading && !error && blogsData.blogs.length === 0 && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              textAlign: 'center',
              borderRadius: 3,
              maxWidth: { xs: '100%', sm: '600px', md: '700px', lg: '800px' },
              mx: 'auto',
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#4b5563',
                mb: 2,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
              }}
            >
              No blog posts found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#6b7280',
                mb: 3,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem', lg: '1.2rem' },
              }}
            >
              Try adjusting your filters or search terms
            </Typography>
            <Button
              variant="contained"
              onClick={clearFilters}
              sx={{
                backgroundColor: '#7f1d1d',
                '&:hover': { backgroundColor: '#991b1b' },
                borderRadius: '8px',
                px: { xs: 2, sm: 3, md: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                textTransform: 'none',
              }}
            >
              Show All Blogs
            </Button>
          </Paper>
        )}

        {!loading && !error && blogsData.blogs.length > 0 && (
          <>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 }}>
              {blogsData.blogs.map((blog, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={blog._id}>
                  <Fade in timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: 6,
                        },
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: 'rgba(255, 255, 255, 0.95)',
                        '&:focus-within': {
                          outline: '2px solid #7f1d1d',
                          outlineOffset: '2px',
                        },
                      }}
                      tabIndex={0} // Make card focusable for keyboard navigation
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          height: { xs: 140, sm: 160, md: 180, lg: 200, xl: 220 }, // Adjusted heights for better proportionality
                          width: '100%',
                          objectFit: 'cover',
                          transition: 'opacity 0.3s ease-in-out',
                          opacity: 1,
                          '&:hover': {
                            opacity: 0.9, // Subtle hover effect on image
                          },
                        }}
                        image={
                          blog.image || `https://source.unsplash.com/random/600x400?${blog.category || 'blog'}`
                        }
                        alt={blog.title || 'Blog image'} // Ensure meaningful alt text
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found'; // Fallback image
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1f2937',
                            mb: 1,
                            height: '3rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                          }}
                        >
                          {blog.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Chip
                            label={blog.category || 'Uncategorized'}
                            size="small"
                            sx={{
                              backgroundColor: '#f3f4f6',
                              color: '#7f1d1d',
                              fontWeight: 500,
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' },
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarIcon
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                              color: '#9ca3af',
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' } }}
                          >
                            {formatDate(blog.createdAt)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            height: '4.5rem',
                            fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' },
                          }}
                        >
                          {truncateText(blog.content)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon
                            sx={{
                              fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                              color: '#9ca3af',
                              mr: 0.5,
                            }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '0.9rem' } }}
                          >
                            {blog.author || 'Anonymous'}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ justifyContent: 'flex-end', p: 1.5, pt: 0 }}>
                        {/* <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          sx={{
                            color: '#7f1d1d',
                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                            px: { xs: 1.5, sm: 2, md: 2.5 },
                            py: { xs: 0.5, sm: 0.75 },
                            '&:hover': {
                              backgroundColor: 'rgba(127, 29, 29, 0.04)',
                            },
                          }}
                        >
                          Read More
                        </Button> */}
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {blogsData.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 3, sm: 4, md: 5 } }}>
                <Pagination
                  count={blogsData.totalPages}
                  page={filters.page}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#ffffff',
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      mx: { xs: 0, sm: 0.5 },
                      minWidth: { xs: 28, sm: 32, md: 36 },
                      height: { xs: 28, sm: 32, md: 36 },
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#7f1d1d',
                      color: '#ffffff',
                    },
                    '& .MuiPaginationItem-root:hover': {
                      backgroundColor: 'rgba(127, 29, 29, 0.2)',
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home;