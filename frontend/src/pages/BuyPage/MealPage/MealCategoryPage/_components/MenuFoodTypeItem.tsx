import { Link } from "react-router-dom";

import "./MenuFoodTypeItem.css";

type MenuFoodTypeItemProps = {
  img: string;
  title: string;
  varieties: string;
};

export default function MenuFoodTypeItem({
  img,
  title,
  varieties,
}: MenuFoodTypeItemProps) {
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
          <Link className="order-now-button" to={`category/${title}`}>
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
