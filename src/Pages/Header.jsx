import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token) {
      setIsAuthenticated(true);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Check authentication status on mount, route changes, and authChange events
  useEffect(() => {
    // Initial check on mount
    checkAuth();

    // Listen for storage events (cross-tab updates)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for custom authChange events (same-tab updates)
    const handleAuthChange = () => {
      // Add a slight delay to ensure localStorage updates are processed
      setTimeout(() => {
        checkAuth();
        setRefreshKey((prev) => prev + 1); // Force re-render
      }, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    // Re-check auth on route changes
    checkAuth();

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Dispatch custom authChange event to notify the Header
    window.dispatchEvent(new Event('authChange'));

    // Update state
    setIsAuthenticated(false);
    setUser(null);
    setAnchorEl(null);

    // Navigate to home page
    navigate('/login', { replace: true });
  };

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get the initial for the avatar (first letter of username, name, or email)
  const getInitial = () => {
    if (!user) return ;

    if (user.name) return user.name[0].toUpperCase();
    if (user.username) return user.username[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();

    return '?';
  };

  // Get the user's display name for the dropdown menu
  const getDisplayName = () => {
    if (!user) return 'User';

    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0]; // Display email prefix (e.g., "user" from "user@example.com")

    return 'User';
  };

  return (
    <AppBar
      position="fixed"
      className="bg-white shadow-md"
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar className="flex justify-between items-center px-4 sm:px-6">
        {/* Logo/Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          className="text-red-900 font-bold text-lg sm:text-xl"
          sx={{
            textDecoration: 'none',
            color: '#7f1d1d',
            fontWeight: 'bold',
          }}
        >
          MyBlog Applications
        </Typography>

        {/* Navigation Links */}
        <Box className="flex items-center space-x-2 sm:space-x-4">
          <Button
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            className="text-gray-700 hover:text-red-900 text-sm sm:text-base"
            sx={{
              textTransform: 'none',
              color: '#6b7280',
              '&:hover': {
                color: '#7f1d1d',
              },
            }}
          >
            Home
          </Button>

          <Button
            component={RouterLink}
            to="/create"
            startIcon={<AddIcon />}
            className="text-gray-700 hover:text-red-900 text-sm sm:text-base"
            sx={{
              textTransform: 'none',
              color: '#6b7280',
              '&:hover': {
                color: '#7f1d1d',
              },
            }}
          >
            Create Post
          </Button>

          {isAuthenticated ? (
            <>
              {/* Avatar with Dropdown Menu */}
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    bgcolor: '#7f1d1d',
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {getInitial()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                  },
                }}
              >
                {/* Display user's name */}
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" sx={{ color: '#6b7280' }}>
                    Hello, {getDisplayName()}!
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={handleMenuClose}
                  component={RouterLink}
                  to="/profile"
                  sx={{ color: '#6b7280', '&:hover': { color: '#7f1d1d' } }}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Profile
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  sx={{ color: '#6b7280', '&:hover': { color: '#7f1d1d' } }}
                >
                  <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Show Login button with icon if not authenticated */}
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                className="text-gray-700 hover:text-red-900 text-sm sm:text-base"
                sx={{
                  textTransform: 'none',
                  color: '#6b7280',
                  '&:hover': {
                    color: '#7f1d1d',
                  },
                }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;