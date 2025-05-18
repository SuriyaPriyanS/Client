import axios from 'axios';

const API_URL = 'http://localhost:5000';

// User Authentication
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Login failed!');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Register response:', response);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error.response?.data?.message || 'Registration failed!';
  }
};
// Blog Operations
export const fetchBlogs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/blog`);
    console.log('Fetch blogs response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error.response?.data?.message || 'Failed to fetch blogs!';
  }
};

export const createdBlog = async (blogData) => {
  try {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    
    const response = await axios.post(`${API_URL}/api/blog`, blogData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Create blog response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error.response?.data?.message || 'Failed to create blog!';
  }
};

// Get single blog by ID
export const fetchBlogById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/blog/${id}`);

    console.log('Fetch blog by ID response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    throw error.response?.data?.message || 'Failed to fetch blog details!';
  }
};

// User Profile Operations
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error.response?.data?.message || 'Failed to fetch profile';
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.put(`${API_URL}/api/profile`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error.response?.data?.message || 'Failed to update profile';
  }
};

export const deleteUserAccount = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.delete(`${API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error.response?.data?.message || 'Failed to delete account';
  }
};

export const getUserBlogs = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/api/blog/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw error.response?.data?.message || 'Failed to fetch user blogs';
  }
};

// Update blog
export const updateBlog = async (id, blogData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.put(`${API_URL}/api/blog/${id}`, blogData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error.response?.data?.message || 'Failed to update blog';
  }
};

// Delete blog
export const deleteBlog = async (blogId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.delete(`${API_URL}/api/blog/${blogId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error.response?.data?.message || 'Failed to delete blog';
  }
};
