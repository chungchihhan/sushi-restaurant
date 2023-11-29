import { useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../HomePage/_components/Navbar";
import { v4 as uuidv4 } from "uuid";

// import Search from '../components/Search';
// import MenuCard from  './MenuCard';
import MenuItem from "./_components/MenuItem";

type MenuData = {
  id: string;
  img: string;
  title: string;
  star: string;
  price: string;
  category: string;
  foodtype: string;
  // description: string;
};

type MenuPageProps = {
  category: string;
};

export default function MenuPage() {
  const { category } = useParams();
  // console.log(category);
  const [menus] = useState<MenuData[]>([
    {
      id: uuidv4(),
      img: "/menu_1_img.jpg",
      title: "藏壽司",
      star: "✩3.5/5",
      price: "NT$130",
      category: "sushi",
      foodtype: "日本料理",
      //   description: "description 1",
    },
    {
      id: uuidv4(),
      img: "/menu_2_img.jpg",
      title: "靜壽司",
      star: "✩4/5",
      price: "NT$130",
      category: "sushi",
      foodtype: "日本料理",
      //   description: "description 2",
    },
    {
      id: uuidv4(),
      img: "/menu_3_img.jpg",
      title: "游壽司",
      star: "✩3.5/5",
      price: "NT$130",
      category: "sushi",
      foodtype: "日本料理",
      //   description: "description 2",
    },
    {
      id: uuidv4(),
      img: "/menu_3_img.jpg",
      title: "盜版游壽司",
      star: "✩1/5",
      price: "NT$130",
      category: "sushi",
      foodtype: "日本料理",
      //   description: "description 2",
    },
  ]);

  return (
    <div className="blue-square-container">
      <div className="blue-square-menu">
        <Navbar />
        <section className="menu-container">
          {menus.map((menu) => (
            <MenuItem
              key={menu.id}
              img={menu.img}
              title={menu.title}
              star={menu.star}
              price={menu.price}
              foodtype={menu.foodtype}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
