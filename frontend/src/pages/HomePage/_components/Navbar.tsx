// import React, { useEffect } from 'react';
import { Link } from "react-router-dom";


export default function Navbar() {
  const userId = localStorage.getItem('userId');

  // useEffect(() => {
  //   if (!userId) {
  //     navigate('/signin');
  //   }
  // }, []);

  const menuLink = userId ? (
    <div className="nav-links">
      <Link to={`/menu/${userId}`}>menu</Link>
    </div>
  ) : (
    <div className="nav-links">
      <Link to="/signin">menu</Link>
    </div>
  );

  return (
    <>
      <div className="navbar">
        {/* <div className="logo">TSMC</div> */}
        <div className="nav-links">
          <Link to="/">home</Link>
        </div>
        {menuLink}
        <div className="nav-links">
          <Link to="/about">about</Link>
        </div>
        <div className="nav-links">
          <Link to="/sessions">sessions</Link>
        </div>
      </div>
    </>
  );
}
