import React, { useState } from "react";
// import StoresPage from './StoresPage';
import { Link } from "react-router-dom";

// import "./MenuFunctions.css";

interface MenuProps {
  onClose: () => void;
}

const LoginFunctions: React.FC<MenuProps> = ({ onClose }) => {
  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };


  return (
    <div className="menu-button-overlay" onClick={handleOutsideClick}>
      <div className="menu-button-content">
        <Link to="/signup" className="single-menu-button-link">
          <div className="single-menu-button">
            <span className="single-menu-button-font">註冊</span>
          </div>
        </Link>
        <Link to="/signin" className="single-menu-button-link">
          <div className="single-menu-button">
            <span className="single-menu-button-font">登入</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LoginFunctions;
