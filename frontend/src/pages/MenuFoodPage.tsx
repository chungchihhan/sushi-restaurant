import LoginButton from '../components/LoginButton';
import MenuButton from '../components/MenuButton';
import BackgroundImage from '../components/BackgroundImage';
import TsmcSushi from '../components/TsmcSushi';
import BlueSquareFix from '../componentsMenuFood/BlueSquareFix';
import { Link } from 'react-router-dom';

export default function MenuFoodPage(){
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
          <BlueSquareFix/>
        </div>
      </div> 
    </>
  )
}