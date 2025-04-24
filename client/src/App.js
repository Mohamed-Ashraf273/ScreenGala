// src/App.js
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/signup.js'
import Home from './components/home.js'
import LogIn from './components/login.js'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ScreenGala/login" />} />
      <Route path="/ScreenGala/login" element={<LogIn />} />
      <Route path="/ScreenGala/signup" element={<SignUp />} />
      <Route path='/ScreenGala/home' element={<Home />} />
    </Routes>
  );
};

export default App;
