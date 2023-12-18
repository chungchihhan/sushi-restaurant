import { Typography } from "@mui/material";

import SearchButtonPng from "./SearchButton.png";
import "./main.css";

export const SearchButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="container-54_2384" onClick={onClick}>
      <div className="container-25_7080">
        <Typography
          className="text-25_7081"
          letterSpacing={0}
          fontSize={24}
          fontWeight={600}
          fontFamily="Roboto"
        >
          開動
        </Typography>
        <img
          className="image-25_7531"
          src={SearchButtonPng}
          alt="SearchButton"
        />
      </div>
    </button>
  );
};
