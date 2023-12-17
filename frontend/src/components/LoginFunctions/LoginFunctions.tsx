import React from "react";
import { Link } from "react-router-dom";

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

  const token = localStorage.getItem("userToken");

  return (
    <>
      {!token && (
        <div className="menu-button-overlay" onClick={handleOutsideClick}>
          <div className="login-button-content">
            <Link to="/signup" className="single-menu-button-link">
              <div className="single-menu-button">
                <span className="single-menu-button-font p-2 font-bold">
                  註冊
                </span>
              </div>
            </Link>
            <Link to="/signin" className="single-menu-button-link">
              <div className="single-menu-button">
                <span className="single-menu-button-font p-2 font-bold">
                  登入
                </span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginFunctions;
