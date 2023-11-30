import { Link } from "react-router-dom";
import "./MealShopListItem.css";

type MealShopListItemProps = {
  id: string;
  img: string;
  title: string;
  star: string;
  price: string;
  foodtype: string;
  //   description: string;
  //   onDelete: () => void;
};

export default function MealShopListItem({
  id,
  img,
  title,
  star,
  price,
  foodtype,
} //   description
//   onDelete,
: MealShopListItemProps) {

  return (
    <Link className="shoplist-item" to={`/meal/${id.toLowerCase()}`}>
      <div className="shoplist-item-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="shoplist-item-details">
        <div className="shoplist-item-first-row">
          <span className="title-style">{title}</span>
          <span className="star-style">{star}</span>
        </div>
        <div className="shoplist-item-second-row">
          <span className="price-style">{price}</span>
          <span className="foodtype-style">{foodtype}</span>
        </div>
      </div>
    </Link>
  );
}
