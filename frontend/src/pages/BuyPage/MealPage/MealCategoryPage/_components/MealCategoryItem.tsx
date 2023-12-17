import { Link } from "react-router-dom";

import "./MealCategoryItem.css";

type MealCategoryItemProps = {
  category: string;
  totalSum: number;
};

export default function MealCategoryItem({
  category,
  totalSum,
}: MealCategoryItemProps) {
  const categoryImages: { [key: string]: string } = {
    中式: "/menu_2_img.jpg",
    美式: "/menu_3_img.jpg",
    日式: "/menu_1_img.jpg",
    韓式: "/shop_1_img.jpg",
    港式: "/shop_2_img.jpg",
    飲料: "/shop_3_img.jpg",
  };

  const defaultImage = "/menu_1_img.jpg";
  const categoryImage = categoryImages[category] || defaultImage;

  return (
    <div className="category-ft-item font-bold">
      <div className="category-ft-item-img-container">
        <img src={categoryImage} alt={category} />
      </div>
      <div className="category-ft-item-details">
        <div className="category-ft-item-first-row text-2xl mt-2">
          <span className="ft-title-style">{category}</span>
          <span className="ft-varieties-style">{totalSum} Shops</span>
        </div>
        <div className="order-now-container">
          <Link className="order-now-button" to={`/meal/category/${category}`}>
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
