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
          <Link to="/menufood">menu</Link>
        </div>
        <div className="nav-links">
          <Link to="/about">about</Link>
        </div>
        <div className="nav-links">
          <Link to="/sessions">sessions</Link>
        </div>
      </div>
      {/* <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="menupage" element={<MenuPage/>} />
            </Routes>
        </Router> */}
    </>
  );
}
