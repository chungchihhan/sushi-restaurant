import React from "react";

import SearchIcon from "./Search.png";
import "./main.css";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="container-25_7082">
      <img className="image-25_7083" src={SearchIcon} alt="Search" />
      <input
        className="h-full w-full rounded-xl border-transparent bg-transparent p-2 text-2xl font-bold text-black placeholder-gray-100"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="輸入餐點名稱"
      />
    </div>
  );
};
