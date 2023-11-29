import { Link } from "react-router-dom";
import "./ShopListItem.css";

type ShopListItemProps = {
  id: string;
  img: string;
  title: string;
  star: string;
  price: string;
  foodtype: string;
  //   description: string;
  //   onDelete: () => void;
};

export default function ShopListItem({
  id,
  img,
  title,
  star,
  price,
  foodtype,
} //   description
//   onDelete,
: ShopListItemProps) {

  return (
    <Link className="shoplist-item" to={`/shop/${id.toLowerCase()}`}>
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
