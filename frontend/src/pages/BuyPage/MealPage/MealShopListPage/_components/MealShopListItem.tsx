import { Link } from "react-router-dom";

import "./MealShopListItem.css";

type MealShopListItemProps = {
  id: string;
  img: string;
  title: string;
  star: string;
};

export default function MealShopListItem({
  id,
  img,
  title,
  star,
}: MealShopListItemProps) {
  return (
    <Link className="shoplist-item" to={`/shopbuyer/${id}`}>
      <div className="shoplist-item-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="shoplist-item-details">
        <div className="shoplist-item-first-row">
          <span className="title-style">{title}</span>
          <span className="star-style">{star}</span>
        </div>
      </div>
    </Link>
  );
}
