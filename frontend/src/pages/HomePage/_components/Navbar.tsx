import { Link } from "react-router-dom";

export default function Navbar() {
  // const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  // const isAuthenticated = token && userId;
  // const isShopCreated = localStorage.getItem("shopId");

  return (
    <>
      <div className="navbar">
        {/* <div className="logo">TSMC</div> */}
        <div className="nav-links">
          <Link to="/" className="rounded-lg p-2 font-bold hover:bg-blue-300">
            首頁
          </Link>
        </div>
        {token ? (
          <div className="nav-links">
            <Link
              to={userRole === "店家" ? "/shopedit" : "/meal"}
              className="rounded-lg p-2 font-bold hover:bg-blue-300"
            >
              商店
            </Link>
          </div>
        ) : (
          <div className="nav-links">
            <Link
              to="/signin"
              className="rounded-lg p-2 font-bold hover:bg-blue-300"
            >
              商店
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
