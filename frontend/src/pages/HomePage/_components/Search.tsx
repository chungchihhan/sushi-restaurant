import React from "react";

import { SearchBar } from "../_components/SearchBar/index";
import { SearchButton } from "../_components/SearchButton/index";

const Search: React.FC = () => {
  return (
    <div className="search-section">
      <div className="searchcomponents">
        <SearchBar />
      </div>
      {/* <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="輸入外送地址"
            /> */}
      <div className="custom-dropdown">
        <select className="dropdown">
          <option className="dropdownlist" value="default">
            立即外送
          </option>
          <option className="dropdownlist" value="north">
            北區
          </option>
          <option className="dropdownlist" value="center">
            中區
          </option>
          <option className="dropdownlist" value="south">
            南區
          </option>
        </select>
      </div>

      <div className="searchcomponents">
        <SearchButton />
      </div>
      {/* <button>開動</button> */}
    </div>
  );
};

export default Search;
