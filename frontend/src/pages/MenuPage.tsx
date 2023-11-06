import { Link } from 'react-router-dom';

import Ramenimg from '../components/Ramenimg';
import Sloganimg from '../components/Sloganimg';
import Specialties from '../components/Specialties';
import Testimonials from '../components/Testimonials';
import BottomContact from '../components/BottomContact';
import BlueSquare from '../components/BlueSquare';

import LoginButton from '../components/LoginButton';
import MenuButton from '../components/MenuButton';
import BackgroundImage from '../components/BackgroundImage';
import TsmcSushi from '../components/TsmcSushi';
import BlueSquareExtend from '../componentsMenu/BlueSquareExtend';


export default function MenuPage(){
  return(
    <>
      <div className="website">
        <BackgroundImage />
      </div>
      <div>
        <div className="header">
          <TsmcSushi/>
          <div className='loginandsushi'>
            <LoginButton/>
            <MenuButton/>   
          </div>
        </div>
        <div>
          <BlueSquareExtend/>
        </div>
        {/* <Ramenimg /> */}
      </div> 
      {/* <div className='firstpagebuttom'>
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
      </div> */}
    </>
  )
}