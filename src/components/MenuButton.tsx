import React, { useState } from 'react';
import {Group1000003135} from "./Group1000003135";
import MenuFunctions from "./MenuFunctions/MenuFunctions";
// import TsmcSushi from "./TsmcSushi"

// function MenuButton() {
//   return (
//     <div>
//       <Group1000003135 />    
//     </div>
//   );
// }
const MenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <div>
          <button className='menubutton' onClick={() => setIsMenuOpen(true)}>
            <Group1000003135 />    
          </button>
          {isMenuOpen && <MenuFunctions onClose={() => setIsMenuOpen(false)} />}
      </div>
  );
}

export default MenuButton;
