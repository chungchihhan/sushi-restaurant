import React from "react";
import { Typography } from "@mui/material";
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
        className="search-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="輸入餐點名稱"
      />
      <Typography
        className="text-25_7086"
        letterSpacing={0}
        fontSize={24}
        fontWeight={400}
        fontFamily="Roboto"
      >
        輸入餐點名稱
      </Typography>
    </div>
  );
};
