  import { useState, useEffect } from 'react';
  import { fetchBlogs } from '../Services/api';

  const useFetchBlogs = (category = '') => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const getBlogs = async () => {
        try {
          const blogData = await fetchBlogs();
          const filteredBlogs = category
            ? blogData.filter(blog => blog.category === category)
            : blogData;
          setBlogs(filteredBlogs);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to load blogs');
          setLoading(false);
        }
      };
      getBlogs();
    }, [category]); // Add category to dependency array

    return { blogs, loading, error };
  };

  export default useFetchBlogs;