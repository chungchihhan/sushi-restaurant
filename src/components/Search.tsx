import React, { useState } from 'react';
import { Frame1000003130 } from "./Frame1000003130";
import { Group1000003139 } from "./Group1000003139";

const Search: React.FC = () => {
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="search-section">
            <div className="searchcomponents">
                <Frame1000003130 />
            </div>
            {/* <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="輸入外送地址"
            /> */}
            <div className="custom-dropdown">
                <select className="dropdown">
                    <option className="dropdownlist" value="default">立即外送</option>
                    <option className="dropdownlist" value="north">北區</option>
                    <option className="dropdownlist" value="center">中區</option>
                    <option className="dropdownlist" value="south">南區</option>
                </select>   
            </div>

            <div className="searchcomponents">
                <Group1000003139 />
            </div>
            {/* <button>開動</button> */}
        </div>
    );
}

export default Search;
