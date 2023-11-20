import React, { useState } from "react";

import MenuFunctions from "../MenuFunctions/MenuFunctions";

import { Menu } from "./Menu";

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
      <button className="menubutton" onClick={() => setIsMenuOpen(true)}>
        <Menu />
      </button>
      {isMenuOpen && <MenuFunctions onClose={() => setIsMenuOpen(false)} />}
    </div>
  );
};

export default MenuButton;
