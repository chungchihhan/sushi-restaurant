import { Typography } from "@mui/material";

import Search from "./Search.png";
import "./main.css";

export const SearchBar = () => {
  return (
    <div className="container-25_7082">
      <img className="image-25_7083" src={Search} alt="Search" />
      <Typography
        className="text-25_7086"
        letterSpacing={0}
        fontSize={24}
        fontWeight={400}
        fontFamily="Roboto"
      >
        輸入外送地址
      </Typography>
    </div>
  );
};
