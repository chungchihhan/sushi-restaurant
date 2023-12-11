import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

import LoginPng from "./Login.png";
import "./main.css";


export const Login = () => {  
  const [username, setUsername] = useState(localStorage.getItem("username"));

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, [username]);

  return (
    <div className="container-25_7480">
      <button className="login-button">
        <img className="image-25_7481" src={LoginPng} alt="Login" />
        <Typography
          className="text-25_7530"
          letterSpacing={0}
          fontSize={24}
          fontWeight={400}
          fontFamily="Roboto"
        >
          {username || "登入"}
        </Typography>
      </button>
    </div>
  );
};
