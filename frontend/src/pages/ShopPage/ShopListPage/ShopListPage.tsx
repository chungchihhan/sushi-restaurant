import { useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../HomePage/_components/Navbar";
import { v4 as uuidv4 } from "uuid";

// import Search from '../components/Search';
import ShopListItem from "./_components/ShopListItem";

type ShopListData = {
  id: string;
  img: string;
  title: string;
  star: string;
  price: string;
  category: string;
  foodtype: string;
  // description: string;
};

type ShopListPageProps = {
  category: string;
};

export default function ShopListPage() {
  const { category } = useParams();

  const [shoplist] = useState<ShopListData[]>([
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
        <section className="shoplist-container">
          {shoplist
            .filter((shop) => shop.category === category)
            .map((shop) => (
              <ShopListItem
                key={shop.id}
                id={shop.id}
                img={shop.img}
                title={shop.title}
                star={shop.star}
                price={shop.price}
                foodtype={shop.foodtype}
              />
            ))}
        </section>
      </div>
    </div>
  );
}
