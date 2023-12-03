import { Link } from "react-router-dom";

import "./MealCategoryItem.css";

type MealCategoryItemProps = {
  img: string;
  title: string;
  varieties: number;
};

export default function MealCategoryItem({
  img,
  title,
  varieties,
}
: MealCategoryItemProps) {
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
            to={`/meal/category/${title.toLowerCase()}`}
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
