import React from 'react';
import '../../index.css';

import Ramenimg from '../../components/ui/Ramenimg';
import BlueSquare from './_components/BlueSquare';
import Sloganimg from './_components/Sloganimg';
import Specialties from './_components/Specialties';
import Testimonials from './_components/Testimonials';
import BottomContact from '../../components/ui/BottomContact';
// import { Routes, Route } from 'react-router-dom';
// import MenuPage from './MenuPage';


const Website: React.FC = () => {
  return (
    <>
      {/* <div className="background-container">
        <img src="path/to/your/pngfile.png" alt="Overlay" id="overlay-image"/>
      </div> */}
      <div>
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
