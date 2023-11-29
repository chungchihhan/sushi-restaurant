import { Link } from "react-router-dom";

import "./ShopCategoryItem.css";

type ShopCategoryItemProps = {
  img: string;
  title: string;
  varieties: number;
};

export default function ShopCategoryItem({
  img,
  title,
  varieties,
}
: ShopCategoryItemProps) {
  return (
    <div className="category-ft-item">
      <div className="category-ft-item-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="category-ft-item-details">
        <div className="category-ft-item-first-row">
          <span className="ft-title-style">{title}</span>
          <span className="ft-varieties-style">{varieties} varieties</span>
        </div>
        <div className="order-now-container">
          <Link
            className="order-now-button"
            to={`/shop/category/${title.toLowerCase()}`}
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
