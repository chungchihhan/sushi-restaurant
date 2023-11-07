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