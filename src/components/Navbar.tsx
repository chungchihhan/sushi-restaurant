import React from 'react';

const Navbar: React.FC = () => {
    return (
        <div className="navbar">
            {/* <div className="logo">TSMC</div> */}
            <div className="nav-links">
                <a href="https://www.youtube.com/">Home</a>
            </div>
            <div className="nav-links">
                <a href="https://www.youtube.com/">Menu</a>      
            </div>
            <div className="nav-links">
                <a href="https://www.youtube.com/">About</a>
            </div>
            <div className="nav-links">
                <a href="https://www.youtube.com/">Sessions</a>
            </div>
        </div>
    );
}
export default Navbar;