import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { getShop } from "../../../../utils/client";

// Meal interface definition
interface Meal {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  active: boolean;
}

interface OrderItem {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  remark: string;
}

interface Order {
  user_id: string;
  orders_by_shop: {
    [shopId: string]: {
      shop_name: string;
      shop_image: string;
      items: OrderItem[];
    };
  };
}

const AllMeals: React.FC = () => {
  const location = useLocation();
  const { filteredMeals } = (location.state as { filteredMeals: Meal[] }) || {};
  const navigate = useNavigate();

  const handleCreateOrder = async (meal: Meal) => {
    const userId = localStorage.getItem("userId") || "";
    const shopId = meal.shop_id; // 從 meal 中獲取 shopId

    try {
      const response = await getShop(shopId);
      const shopDetails = response.data;

      if (!shopId || !shopDetails) {
        console.error("Shop ID is undefined or shopDetails is missing");
        toast.error("Cannot place order.");
        return;
      }

      let existingOrder: Order = JSON.parse(
        localStorage.getItem("currentOrder") || "{}",
      );

      // Ensure the structure is correct
      if (!existingOrder.orders_by_shop) {
        existingOrder = {
          user_id: userId,
          orders_by_shop: {},
        };
      }

      // Check if the shop exists in the order, if not, initialize
      if (!existingOrder.orders_by_shop[shopId]) {
        existingOrder.orders_by_shop[shopId] = {
          shop_name: shopDetails.name,
          shop_image: shopDetails.image,
          items: [],
        };
      }

      const existingMealIndex = existingOrder.orders_by_shop[
        shopId
      ].items.findIndex((item) => item.meal_id === meal.id);

      // Add the meal to the specific shop's order
      if (existingMealIndex !== -1) {
        // If the meal exists, increment the quantity
        existingOrder.orders_by_shop[shopId].items[
          existingMealIndex
        ].quantity += 1;
      } else {
        // If the meal doesn't exist, add it with quantity 1
        existingOrder.orders_by_shop[shopId].items.push({
          meal_id: meal.id,
          meal_name: meal.name,
          quantity: 1,
          price: meal.price,
          remark: "無",
        });
      }

      // Save the updated order to localStorage
      localStorage.setItem("currentOrder", JSON.stringify(existingOrder));
      toast.success("Meal added to cart!");

      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      console.error("Error fetching shop details", error);
      toast.error("Error fetching shop details");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="blue-square-container">
        <div className="blue-square-menu rounded-2xl">
          <span className="py-4 text-4xl font-bold">搜尋結果</span>
          {filteredMeals && filteredMeals.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-8 px-4 pt-4 md:grid-cols-2">
              {filteredMeals.map((meal: Meal) => (
                <div
                  key={meal.id}
                  className="w-100 flex flex-row rounded-lg bg-white p-4 shadow-lg"
                >
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="h-48 w-48 self-center rounded-lg object-cover"
                  />
                  <div className="ml-6 mt-2 flex w-full flex-col items-start md:w-1/2">
                    <h3 className="break-words pb-2 text-2xl font-semibold">
                      {meal.name}
                    </h3>
                    <span className="font-bold text-gray-900">
                      價格: ${meal.price}
                    </span>
                    <p className="mt-5 text-gray-600">{meal.description}</p>
                  </div>
                  <div className="justify-end text-lg">
                    <button
                      className="mt-40 rounded bg-blue-500 px-4 py-2 text-xl font-bold text-white hover:bg-blue-700"
                      onClick={() => handleCreateOrder(meal)}
                    >
                      加入
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col justify-center rounded-md p-8">
              <p className="mb-4 flex justify-center text-center text-3xl font-bold">
                搜尋不到任何餐點
              </p>
              <Link
                className="m-4 w-1/3 self-center rounded-full bg-slate-400 px-4 py-2 text-center font-bold text-white hover:bg-gray-700"
                to={`/`}
              >
                重新搜尋
              </Link>
              <Link
                className="m-4 w-1/3 self-center rounded-full bg-slate-400 px-4 py-2 text-center font-bold text-white hover:bg-gray-700"
                to={`/meal/`}
              >
                前往選購
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllMeals;
