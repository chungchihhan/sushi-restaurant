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
    中式: "/中式.jpg",
    美式: "/美式.jpg",
    日式: "/日式.webp",
    韓式: "/韓式.jpg",
    港式: "/港式.jpg",
    飲料: "/飲料.jpg",
  };

  const defaultImage = "/menu_1_img.jpg";
  const categoryImage = categoryImages[category] || defaultImage;

  return (
    <div className="category-ft-item font-bold">
      <div className="category-ft-item-img-container">
        <img src={categoryImage} alt={category} />
      </div>
      <div className="category-ft-item-details">
        <div className="category-ft-item-first-row mt-2 text-2xl">
          <span className="ft-title-style">{category}</span>
          <span className="ft-varieties-style">{totalSum} 間店</span>
        </div>
        <div className="order-now-container">
          <Link className="order-now-button" to={`/meal/category/${category}`}>
            去點餐
          </Link>
        </div>
      </div>
    </div>
  );
}
