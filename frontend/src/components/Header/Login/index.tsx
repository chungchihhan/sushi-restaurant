import React from "react";
import "./main.css";
import { Typography } from "@mui/material";

import LoginPng from "./Login.png";

export const Login = () => {
  return (
    <div className="container-25_7480">
      <button className="login-button">
        <img
        className="image-25_7481"
        src={LoginPng}
        alt="Login"
        />
        <Typography
          className="text-25_7530"
          letterSpacing={0}
          fontSize={24}
          fontWeight={400}
          fontFamily="Roboto"
        >
          登入
        </Typography>
      </button>
    </div>
  );
};
