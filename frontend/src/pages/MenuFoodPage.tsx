import BackgroundImage from '../components/BackgroundImage';
import BlueSquareFix from '../componentsMenuFood/BlueSquareFix';
import { Link } from 'react-router-dom';

export default function MenuFoodPage(){
  return(
    <>
      <div className="website">
        <BackgroundImage />
      </div>
      <div>
        <BlueSquareFix/>
      </div>
    </>
  )
}