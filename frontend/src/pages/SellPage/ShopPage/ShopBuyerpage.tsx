import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { createOrder } from "../../../utils/client";
import { ToastContainer, toast } from "react-toastify";

// Replace with the actual import path of your API functions
import { getShop, getMealsByShopId } from "../../../utils/client";

interface ShopDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  image: string;
}

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  // Add other relevant fields
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

const ShopBuyerPage: React.FC = () => {
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const { shopId } = useParams<{ shopId: string }>();

  useEffect(() => {
    if (shopId) {
      fetchShopDetails(shopId);
      fetchMeals(shopId);
    }
  }, [shopId]);

  const fetchShopDetails = async (shopId: string) => {
    try {
      const response = await getShop(shopId);
      setShopDetails(response.data);
    } catch (error) {
      console.error("Error fetching shop details", error);
    }
  };

  const fetchMeals = async (shopId: string) => {
    try {
      const response = await getMealsByShopId(shopId);
      setMeals(response.data);
    } catch (error) {
      console.error("Error fetching meals", error);
    }
  };

  const handleCreateOrder = async (meal: Meal) => {
    const userId = localStorage.getItem("userId") || "";

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
  };

  return (
    <>
      <ToastContainer />
      <div>
        <div className="mx-auto max-w-2xl p-4">
          {shopDetails && (
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4">
                <img
                  className="h-40 w-full rounded-lg object-cover"
                  src={shopDetails.image}
                  alt="Shop"
                />
              </div>
              <div className="mb-4">
                <h1 className="text-xl font-semibold">{shopDetails.name}</h1>
                <p className="text-gray-600">{shopDetails.address}</p>
                <p className="text-gray-600">{shopDetails.phone}</p>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                {/* Assuming `category` is something like an array of strings */}
                {/* {shopDetails.category.split(',').map(cat => (
                <span className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  {cat.trim()}
                </span>
              ))} */}
              </div>
            </div>
          )}

          <h2 className="mb-4 mt-6 text-2xl font-semibold">Meals</h2>
          <div className="grid grid-cols-2 gap-4">
            {meals.map((meal: Meal) => (
              <div key={meal.id} className="rounded-lg bg-white p-4 shadow-lg">
                <img
                  className="mb-4 h-32 w-full rounded-lg object-cover"
                  src={meal.image}
                  alt="Meal"
                />
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{meal.name}</h3>
                  <p className="text-gray-600">{meal.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{meal.price}</span>
                  <button
                    className="rounded bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-700"
                    onClick={() => handleCreateOrder(meal)}
                  >
                    Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopBuyerPage;
