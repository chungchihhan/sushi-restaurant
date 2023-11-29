import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../HomePage/_components/Navbar";
import ShopMealItem from "./_component/ShopMealItem";

type ShopData = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  category: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

type ShopMealItemProps = {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
};

export default function ShopPage() {
  const { id } = useParams();
  const [shop] = useState<ShopData>({
    id: "140f871c-e391-46be-8c3b-6bef621edf6a",
    user_id: "user123",
    name: "假名壽司店",
    address: "台北市中正區假街1號",
    phone: "02-12345678",
    image: "/fake_shop_image.jpg",
    category: "sushi",
    monday: "10:00 AM - 8:00 PM",
    tuesday: "10:00 AM - 8:00 PM",
    wednesday: "10:00 AM - 8:00 PM",
    thursday: "10:00 AM - 8:00 PM",
    friday: "10:00 AM - 8:00 PM",
    saturday: "10:00 AM - 6:00 PM",
    sunday: "Closed",
  });

  const [meals] = useState<ShopMealItemProps[]>([
    {
      id: "1",
      shop_id: "140f871c-e391-46be-8c3b-6bef621edf6a",
      name: "特色壽司套餐",
      description: "新鮮美味的特色壽司套餐，包含各種口味。",
      price: 180,
      quantity: 10,
      category: "sushi",
      image: "/input-onlinepngtools.png",
    },
    {
      id: "2",
      shop_id: "140f871c-e391-46be-8c3b-6bef621edf6a",
      name: "海鮮拉麵",
      description: "滿滿的海鮮配上爽口拉麵，絕對滿足您的味蕾。",
      price: 150,
      quantity: 15,
      category: "noodles",
      image: "/input-onlinepngtools.png",
    },
    {
      id: "3",
      shop_id: "140f871c-e391-46be-8c3b-6bef621edf6a",
      name: "和風炸豬排",
      description: "酥脆的炸豬排搭配日式醬汁，好吃到讓您一口接一口。",
      price: 160,
      quantity: 12,
      category: "rice",
      image: "/input-onlinepngtools.png",
    },
  ]);

  return (
    <div>
      <div className="blue-square-container">
        <div className="blue-square-menu">
          <Navbar />
          <div className="shop-detail-container">
            <div className="shop-detail-header">
              <h2>{shop.name}</h2>
              <span className="shop-category">{shop.category}</span>
            </div>
            <div className="shop-detail-info">
              <p>{shop.address}</p>
              <p>{shop.phone}</p>
            </div>
            <div className="shop-opening-hours">
              <h3>營業時間</h3>
              <ul>
                <li>星期一: {shop.monday}</li>
                <li>星期二: {shop.tuesday}</li>
                <li>星期三: {shop.wednesday}</li>
                <li>星期四: {shop.thursday}</li>
                <li>星期五: {shop.friday}</li>
                <li>星期六: {shop.saturday}</li>
                <li>星期日: {shop.sunday}</li>
              </ul>
            </div>
          </div>
          <section className="shoplist-container">
            {meals
              .filter((meal) => meal.shop_id === id)
              .map((meal) => (
                <ShopMealItem
                  key={meal.id}
                  id={meal.id}
                  shop_id={meal.shop_id}
                  name={meal.name}
                  description={meal.description}
                  price={meal.price}
                  quantity={meal.quantity}
                  category={meal.category}
                  image={meal.image}
                />
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}
