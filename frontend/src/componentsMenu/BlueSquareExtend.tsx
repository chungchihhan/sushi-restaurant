import Navbar from '../components/Navbar';
// import Search from '../components/Search';
// import MenuCard from  './MenuCard';
import MenuItem from './MenuItem';
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type MenuData = {
    id: string
    img: string
    title: string;
    star: string;
    price: string;
    foodtype: string;  
    // description: string;
  }; 

export default function BlueSquareExtend(){
    const [menus, setMenus] = useState<MenuData[]>([
        {
            id: uuidv4(),
            img: "/menu_1_img.jpg",
            title: "藏壽司",
            star: "✩3.5/5",
            price: "NT$130",
            foodtype: "日本料理",
            //   description: "description 1",
        },
        {
            id: uuidv4(),
            img: "/menu_2_img.jpg",
            title: "靜壽司",
            star: "✩4/5",
            price: "NT$130",
            foodtype: "日本料理",
            //   description: "description 2",
        },
        {
            id: uuidv4(),
            img: "/menu_3_img.jpg",
            title: "游壽司",
            star: "✩3.5/5",
            price: "NT$130",
            foodtype: "日本料理",
            //   description: "description 2",
        },
        {
            id: uuidv4(),
            img: "/menu_3_img.jpg",
            title: "盜版游壽司",
            star: "✩1/5",
            price: "NT$130",
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
                    // description={menu.description}
                    // onDelete={() => deleteTodo(menu.id)}
                />
              ))}
            </section>
            {/* <MenuCard/> */}
          </div>
        </div>
      );
}

