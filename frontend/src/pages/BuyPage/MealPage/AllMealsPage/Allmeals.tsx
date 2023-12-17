import React from "react";
import { useLocation } from "react-router-dom";
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

      // Add the meal to the specific shop's order
      existingOrder.orders_by_shop[shopId].items.push({
        meal_id: meal.id,
        meal_name: meal.name,
        quantity: 1,
        price: meal.price,
        remark: "不要辣！",
      });

      // Save the updated order to localStorage
      localStorage.setItem("currentOrder", JSON.stringify(existingOrder));
      toast.success("Meal added to order!");
    } catch (error) {
      console.error("Error fetching shop details", error);
      toast.error("Error fetching shop details");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Render all meals */}
          {filteredMeals &&
            filteredMeals.map((meal: Meal) => (
              <div
                key={meal.id}
                className="overflow-hidden rounded-lg border shadow-lg"
              >
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-64 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-lg font-bold">{meal.name}</h3>
                  <p className="mb-2 text-sm text-gray-700">
                    {meal.description}
                  </p>
                  <p className="text-sm text-gray-600">Price: ${meal.price}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {meal.quantity}
                  </p>
                </div>
                <button
                  className="rounded bg-blue-500 px-4 py-1 text-xl font-bold text-white hover:bg-blue-700"
                  onClick={() => handleCreateOrder(meal)}
                >
                  Order
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default AllMeals;
