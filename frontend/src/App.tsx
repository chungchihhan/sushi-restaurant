import React from 'react';
import './index.css';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MenuFoodPage from './pages/MenuFoodPage';
import AboutPage from './pages/MenuPage';
import SessionsPage from './pages/MenuPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const Website: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage/>} />
          <Route path="/menufood" element={<MenuFoodPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/sessions" element={<SessionsPage/>} />
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
}

export default Website;
