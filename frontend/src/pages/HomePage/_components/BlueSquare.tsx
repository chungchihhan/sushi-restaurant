import React from "react";

import Navbar from "./Navbar";
import Search from "./Search";

const BlueSquare: React.FC = () => {
  return (
    <div className="blue-square-container">
      <div className="blue-square rounded-2xl">
        <Navbar />
        <div className="search-wrapper">
          <Search />
        </div>
      </div>
    </div>
  );
};

export default BlueSquare;
