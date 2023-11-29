import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuPage from "../MenuPage/MenuPage";

import "./ShopTypeItem.css";

type ShopTypeItemProps = {
  img: string;
  title: string;
  varieties: number;
};

export default function ShopTypeItem({
  img,
  title,
  varieties,
}
: ShopTypeItemProps) {
  return (
    <div className="menu-ft-item">
      <div className="menu-ft-item-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="menu-ft-item-details">
        <div className="menu-ft-item-first-row">
          <span className="ft-title-style">{title}</span>
          <span className="ft-varieties-style">{varieties} varieties</span>
        </div>
        <div className="order-now-container">
          {/* <Route path={`/menu/${title.toLowerCase()}`} element={<MenuPage category={title} />} /> */}
          <Link
            className="order-now-button"
            to={`/shop/${title.toLowerCase()}`}
          >
            Order Now
          </Link>
          {/* <MenuPage category={title} /> */}
        </div>
      </div>
    </div>
  );
}
