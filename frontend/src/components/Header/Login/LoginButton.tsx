import React, { useState } from "react";

import { Login } from ".";
import LoginFunctions from "../../LoginFunctions/LoginFunctions";

const LoginButton: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div>
      <div className="loginbutton" onClick={() => setIsLoginOpen(true)}>
        <Login />
      </div>
      {isLoginOpen && <LoginFunctions onClose={() => setIsLoginOpen(false)} />}
    </div>
  );
};

export default LoginButton;
