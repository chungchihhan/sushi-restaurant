import "./MenuItem.css";

type MenuItemProps = {
  img: string;
  title: string;
  star: string;
  price: string;
  foodtype: string;
  //   description: string;
  //   onDelete: () => void;
};

export default function MenuItem({
  img,
  title,
  star,
  price,
  foodtype,
} //   description
//   onDelete,
: MenuItemProps) {
  return (
    <div className="menu-item">
      <div className="menu-item-img-container">
        <img src={img} alt={title} />
      </div>
      <div className="menu-item-details">
        <div className="menu-item-first-row">
          <span className="title-style">{title}</span>
          <span className="star-style">{star}</span>
        </div>
        <div className="menu-item-second-row">
          <span className="price-style">{price}</span>
          <span className="foodtype-style">{foodtype}</span>
        </div>
      </div>
    </div>
  );
}
