import React from 'react';
import '../index.css';

import Ramenimg from '../components/Ramenimg';
import LoginButton from '../components/LoginButton';
import MenuButton from '../components/MenuButton';
// import BackgroundImage from '../components/BackgroundImage';
import BlueSquare from '../components/BlueSquare';
import Sloganimg from '../components/Sloganimg';
import Specialties from '../components/Specialties';
import Testimonials from '../components/Testimonials';
import BottomContact from '../components/BottomContact';
import TsmcSushi from '../components/TsmcSushi';
// import { Routes, Route } from 'react-router-dom';
// import MenuPage from './MenuPage';


const Website: React.FC = () => {
  return (
    <>
      {/* <div className="background-container">
        <img src="path/to/your/pngfile.png" alt="Overlay" id="overlay-image"/>
      </div> */}
      {/* <div className="website">
        <BackgroundImage />
      </div> */}
      <div>
        {/* <div className="header">
          <TsmcSushi/>
          <div className='loginandsushi'>
            <LoginButton/>
            <MenuButton/>   
          </div>
        </div> */}
        <div>
          <BlueSquare />
        </div>
        <Ramenimg />
      </div> 
      <div className='firstpagebuttom'>
        <Sloganimg/>
      </div>
      <div>
        <Specialties/>
      </div>
      <div className='firstpagebuttom'>
        <Testimonials/>
      </div>
      <div className='firstpagebuttom'>
        <BottomContact/>
      </div>
    </>
  );
}

export default Website;
