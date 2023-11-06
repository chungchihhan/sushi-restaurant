import React from 'react';
import Navbar from '../components/Navbar';
// import Search from '../components/Search';


const BlueSquareExtend: React.FC = () => {
  return (
    <div className="blue-square-container">
      <div className="blue-square">
        <Navbar />
        <div className="search-wrapper">
          {/* <Search /> */}
        </div>
        <h1>hello</h1>
      </div>
    </div>
  );
}

export default BlueSquareExtend;
