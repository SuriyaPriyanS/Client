import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'
import Register from './Pages/Regsiter'
import Home from './Pages/Homepages';
import Header from './Pages/Header';
import CreateBlog from './Components/BlogCreated';
import Profile from './Pages/Profile';
import BlogEdited from './Components/BlogEdited';
import BlogDeleted from './Components/BlogDelted';

const App = () => {
  return (
    <div>
      <Router>
        <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={< CreateBlog/>} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
         {/* <Route path="/blog/:id" element={<BlogDetails />} /> */}
        <Route path="/blog/edit/:id" element={<BlogEdited />} />
        <Route path='/blog/delete/:id' element={<BlogDeleted />} />
        {/* <Route path="*" element={<div>404 - Page Not Found</div>} /> */}
      </Routes>
    </Router>
    </div>
  );
};

export default App;