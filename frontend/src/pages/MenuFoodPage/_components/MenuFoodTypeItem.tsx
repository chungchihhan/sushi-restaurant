import { Link } from "react-router-dom";

import "./MenuFoodTypeItem.css";

type MenuFoodTypeItemProps = {
  img: string;
  title: string;
  varieties: string;
  //   description: string;
  //   onDelete: () => void;
};

export default function MenuFoodTypeItem({
  img,
  title,
  varieties, //   description
  //   onDelete,
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
          <Link className="order-now-button" to="/menu">
            Order Now
          </Link>
        </div>
        {/* <div className="ft-menu-item-second-row">
            <span className="ft-price-style">{price}</span>
            <span className="ft-foodtype-style">{foodtype}</span>
            </div> */}
      </div>

      {/* <button className="delete-todo" onClick={onDelete}>
          delete
        </button> */}
      {/* <p className="todo-description">{description}</p> */}
    </div>
  );
}
