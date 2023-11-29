import React, { useState } from "react";

import LoginFunctions from "../../LoginFunctions/LoginFunctions";


import { Login } from ".";

const LoginButton:React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <div className="loginbutton" onClick={() => setIsLoginOpen(true)}>
        <Login />
      </div>
      {isLoginOpen && <LoginFunctions onClose={() => setIsLoginOpen(false)} />}
    </div>
    
  );
}

export default LoginButton;
