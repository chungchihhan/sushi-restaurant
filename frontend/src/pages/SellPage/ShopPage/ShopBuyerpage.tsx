import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { createOrder } from "../../../utils/client";

import { ToastContainer, toast } from "react-toastify";

interface ShopDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  image:string;
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

// Replace with the actual import path of your API functions
import { getShop, getMealsByShopId } from "../../../utils/client";

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
    
    if (typeof shopId === 'undefined' || !shopDetails) {
      console.error("Shop ID is undefined or shopDetails is missing");
      toast.error("Cannot place order.");
      return;
    }
  
    let existingOrder = JSON.parse(localStorage.getItem("currentOrder") || "{}");
  
    // Check if the order is for the same shop
    if (existingOrder.shop_id === shopId) {
      existingOrder.order_items.push({
        meal_id: meal.id, 
        meal_name: meal.name, 
        quantity: 1, 
        price: meal.price, 
        remark: "不要辣！"
      });
    } else {
      // Create a new order for a different shop
      existingOrder = {
        user_id: userId,
        shop_id: shopId,
        shop_name: shopDetails.name,
        shop_image: shopDetails.image,
        order_items: [
          {
            meal_id: meal.id, 
            meal_name: meal.name, 
            quantity: 1, 
            price: meal.price, 
            remark: "不要辣！"
          }
        ],
      };
    }
  
    // Save the updated order to localStorage
    localStorage.setItem("currentOrder", JSON.stringify(existingOrder));
    toast.success("Meal added to order!");
  };
  
  

  return (
    <>
    <ToastContainer />
    <div>
      <div className="max-w-2xl mx-auto p-4">
        {shopDetails && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <img className="w-full h-40 object-cover rounded-lg" src={shopDetails.image} alt="Shop" />
            </div>
            <div className="mb-4">
              <h1 className="text-xl font-semibold">{shopDetails.name}</h1>
              <p className="text-gray-600">{shopDetails.address}</p>
              <p className="text-gray-600">{shopDetails.phone}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Assuming `category` is something like an array of strings */}
              {/* {shopDetails.category.split(',').map(cat => (
                <span className="bg-blue-200 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  {cat.trim()}
                </span>
              ))} */}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-6 mb-4">Meals</h2>
        <div className="grid grid-cols-2 gap-4">
          {meals.map((meal: Meal) => (
            <div key={meal.id} className="bg-white p-4 rounded-lg shadow-lg">
              <img className="w-full h-32 object-cover rounded-lg mb-4" src={meal.image} alt="Meal" />
              <div className="mb-2">
                <h3 className="text-lg font-semibold">{meal.name}</h3>
                <p className="text-gray-600">{meal.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">{meal.price}</span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" onClick={() => handleCreateOrder(meal)}>
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
