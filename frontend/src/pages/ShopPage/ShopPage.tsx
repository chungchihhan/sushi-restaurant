import { Link } from "react-router-dom";

import React from "react";
import { useState } from "react";

import Navbar from "../HomePage/_components/Navbar";
import { v4 as uuidv4 } from "uuid";

// import Search from './Search';
import ShopTypeItem from "./_components/ShopTypeItem";

import category from "@lib/category.json";

type ShopData = {
  id: string;
  title: string;
  img: string;
  varieties: number;
  // description: string;
};

export default function ShopPage() {
  const [menus] = useState<ShopData[]>([
    {
      id: uuidv4(),
      img: "/shop_1_img.jpg",
      title: "SUSHI",
      varieties: 12,
      //   description: "description 1",
    },
    {
      id: uuidv4(),
      img: "/shop_2_img.jpg",
      title: "RAMEN",
      varieties: 2,
      //   description: "description 2",
    },
    {
      id: uuidv4(),
      img: "/shop_3_img.jpg",
      title: "MOCHI",
      varieties: 123,
      //   description: "description 2",
    },
    {
      id: uuidv4(),
      img: "/shop_4_img.jpg",
      title: "ONIGIRI",
      varieties: 0,
      //   description: "description 2",
    },
  ]);

  return (
    <div className="blue-square-container">
      <div className="blue-square-menu">
        <Navbar />
        <div className="food-types-container">
          {menus.map((menu) => (
            <ShopTypeItem
              key={menu.title}
              img={menu.img}
              title={menu.title}
              varieties={menu.varieties}
              // price={menu.price}
              // foodtype={menu.foodtype}
              // description={menu.description}
              // onDelete={() => deleteTodo(menu.id)}
            />
          ))}
          {/* {category.map((category: ShopData) => (
            <ShopTypeItem
              key={category.title}
              img={category.img}
              title={category.title}
              varieties={category.varieties}
              // price={menu.price}
              // foodtype={menu.foodtype}
              // description={menu.description}
              // onDelete={() => deleteTodo(menu.id)}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}

