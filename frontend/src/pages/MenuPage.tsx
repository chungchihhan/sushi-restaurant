import BackgroundImage from '../components/BackgroundImage';
import BlueSquareExtend from '../componentsMenu/BlueSquareExtend';


export default function MenuPage(){
  return(
    <>
      <div className="website">
        <BackgroundImage />
      </div>
      <div>
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