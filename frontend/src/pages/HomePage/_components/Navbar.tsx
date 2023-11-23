import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="navbar">
        {/* <div className="logo">TSMC</div> */}
        <div className="nav-links">
          <Link to="/">home</Link>
        </div>
        <div className="nav-links">
          <Link to="/shop">shop</Link>
        </div>
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
