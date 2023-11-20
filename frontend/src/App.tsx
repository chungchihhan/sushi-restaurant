import React from 'react';
import './index.css';

import BackgroundImage from './components/BackgroundImage';
import LoginButton from './components/LoginButton';
import MenuButton from './components/MenuButton';
import TsmcSushi from './components/TsmcSushi';

import HomePage from './pages/HomePage';
import UserPage from './pages/UserPage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/MenuPage';
import SessionsPage from './pages/MenuPage';
import RecordPage from './pages/RecordPage';
import MenuFoodPage from './pages/MenuFoodPage';
import SignUpPage from './pages/SignUpPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Website: React.FC = () => {
  return (
    <>
      <Router>
        <div className="website">
          <BackgroundImage />
        </div>
        <div className="header">
            <TsmcSushi/>
            <div className='loginandsushi'>
              <LoginButton/>
              <MenuButton/>   
            </div>
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserPage/>} />
          <Route path="/menu" element={<MenuPage/>} />
          <Route path="/menufood" element={<MenuFoodPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/sessions" element={<SessionsPage/>} />
          <Route path="/record" element={<RecordPage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
        </Routes>
        {/* other components that are not routing-related */}
      </Router>
    </>
  );
}

export default Website;
