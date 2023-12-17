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
          <Link to="/" className="p-2 hover:bg-blue-300 rounded-lg font-bold">首頁</Link>
        </div>
        {token ? (
          <div className="nav-links">
            <Link to={userRole === "店家" ? "/shopedit" : "/meal"} 
              className="p-2 hover:bg-blue-300 rounded-lg font-bold">
                商店
            </Link>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/signin" className="p-2 hover:bg-blue-300 rounded-lg font-bold">商店</Link>
          </div>
        )}
      </div>
    </>
  );
}
