import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createOrder } from "../../../utils/client";


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
      console.log(123);
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
    // Assuming there's a user ID available
    const userId = localStorage.getItem("userId") || ""; 
    
    if (typeof shopId === 'undefined') {
      console.error("Shop ID is undefined");
      // Handle the undefined case here (e.g., show error message)
      return;
    }
    // Construct the order payload
    const orderPayload = {
      user_id: userId,
      shop_id: shopId,
      order_items: [
        {
          meal_id: meal.id,
          quantity: 1 // Assuming quantity is 1 for this example
        }
      ],
      remark: "Please deliver as soon as possible"
    };

    // Call the createOrder function
    try {
      const response = await createOrder(shopId, orderPayload);
      console.log("Order created successfully", response);
      // Handle successful order creation (e.g., show a success message)
    } catch (error) {
      console.error("Error creating order", error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
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
  );
};

export default ShopBuyerPage;
