import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("userToken");

  const menuLink = token ? (
    <div className="nav-links">
      <Link to={`/meal`}>meal</Link>
    </div>
  ) : (
    <div className="nav-links">
      <Link to="/signin">meal</Link>
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
