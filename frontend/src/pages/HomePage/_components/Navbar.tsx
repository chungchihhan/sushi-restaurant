import { Link } from "react-router-dom";

export default function Navbar() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const isAuthenticated = token && userId;
  const isShopCreated = localStorage.getItem("shopId");

  return (
    <>
      <div className="navbar">
        {/* <div className="logo">TSMC</div> */}
        <div className="nav-links">
          <Link to="/">home</Link>
        </div>
        {token ?(
        <div className="nav-links">
          <Link
            to={userRole === "店家" ? "/shopedit" : "/meal"}
          >
            shop
          </Link>
        </div>
        ):(
          <div className="nav-links">
          <Link to="/signin">meal</Link>
          </div>
        )}
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
