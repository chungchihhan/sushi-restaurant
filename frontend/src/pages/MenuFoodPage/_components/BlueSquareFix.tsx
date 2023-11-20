import React from 'react';
import Navbar from '../../HomePage/_components/Navbar';
// import Search from './Search';
import MenuFoodTypeItem from './MenuFoodTypeItem';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type MenuFoodData = {
  id: string
  img: string
  title: string;
  varieties: string;
  // description: string;
}; 

export default function BlueSquareFix(){
  const [menus, ] = useState<MenuFoodData[]>([
      {
          id: uuidv4(),
          img: "/menufood_1_img.jpg",
          title: "SUSHI",
          varieties: "12",
          //   description: "description 1",
      },
      {
          id: uuidv4(),
          img: "/menufood_2_img.jpg",
          title: "RAMEN",
          varieties: "2",
          //   description: "description 2",
      },
      {
          id: uuidv4(),
          img: "/menufood_3_img.jpg",
          title: "MOCHI",
          varieties: "123",
          //   description: "description 2",
      },
      {
          id: uuidv4(),
          img: "/menufood_4_img.jpg",
          title: "ONIGIRI",
          varieties: "23",
        //   description: "description 2",
      },
    ]);

    return (
      <div className="blue-square-container">
        <div className="blue-square-menu">
          <Navbar />
          <div className="food-types-container">
            {menus.map((menu) => (
              <MenuFoodTypeItem
                  key={menu.id}
                  img={menu.img}
                  title={menu.title}
                  varieties={menu.varieties}
                  // price={menu.price}
                  // foodtype={menu.foodtype}
                  // description={menu.description}
                  // onDelete={() => deleteTodo(menu.id)}
              />
            ))}
          </div>
        </div>
      </div>
    );
}


