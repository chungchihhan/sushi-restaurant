// import "./MenuItem.css";

type MenuFoodTypeProps = {
  img: string;
  title: string;
  star: string;
  price: string;
  foodtype: string;
  //   description: string;
  //   onDelete: () => void;
};

export default function MenuFoodType({
  img,
  title,
  star,
  price,
  foodtype,
} //   description
//   onDelete,
: MenuFoodTypeProps) {
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
      {/* <button className="delete-todo" onClick={onDelete}>
          delete
        </button> */}
      {/* <p className="todo-description">{description}</p> */}
    </div>
  );
}
