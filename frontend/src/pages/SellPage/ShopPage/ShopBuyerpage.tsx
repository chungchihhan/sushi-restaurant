import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { createOrder } from "../../../utils/client";
import { ToastContainer, toast } from "react-toastify";

// Replace with the actual import path of your API functions
import { getShop, getMealsByShopId } from "../../../utils/client";
import "@fortawesome/fontawesome-free/css/all.css";

interface ShopDetails {
  id: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  image: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
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
  const [categories, setCategories] = useState<string[]>([]);
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

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

      const uniqueCategories = response.data
        .map((meal) => meal.category)
        .filter((value, index, self) => self.indexOf(value) === index);

      setCategories(uniqueCategories);
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

    const existingMealIndex = existingOrder.orders_by_shop[
      shopId
    ].items.findIndex((item) => item.meal_id === meal.id);

    // Add the meal to the specific shop's order
    if (existingMealIndex !== -1) {
      // If the meal exists, increment the quantity
      existingOrder.orders_by_shop[shopId].items[existingMealIndex].quantity +=
        1;
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
    navigate("/cart");

    toast.success("Meal added to cart!");
  };

  const filterMealsByCategory = (category: string) => {
    return meals.filter((meal) => meal.category === category);
  };

  return (
    <>
      <ToastContainer />
      <div>
        <div className="p-4">
          {shopDetails && (
            <div className="blue-square-menu mx-auto flex flex-col gap-2 rounded-2xl p-4 font-bold shadow-lg">
              <div className="h-80 w-full rounded-xl">
                <img
                  className="h-full w-full rounded-lg bg-white object-cover opacity-80"
                  src={shopDetails.image}
                  alt="Shop"
                />
              </div>
              <div className="mt-3 w-full bg-transparent text-center">
                <h1
                  className="ml-4 text-5xl font-bold underline"
                  style={{ width: "fit-content" }}
                >
                  {shopDetails.name}
                </h1>
                <div className="mt-4 flex w-full flex-row justify-start space-x-2 ">
                  <div className="ml-4 flex justify-center space-x-1">
                    <i className="fas fa-star text-yellow-600"></i>
                    <i className="fas fa-star text-yellow-600"></i>
                    <i className="fas fa-star text-yellow-600"></i>
                    <i className="fas fa-star text-yellow-600"></i>
                    <i className="fas fa-star-half-alt text-yellow-600"></i>
                  </div>
                  <span className="text-sm text-gray-700">4.3/5</span>
                  <span className="text-sm text-gray-700">平均消費:</span>
                  <span className="text-sm text-gray-700">$200</span>
                  <span className="text-sm text-gray-700">
                    餐廳類型：{shopDetails.category}
                  </span>
                </div>
                <div className="ml-4 mt-3 flex justify-start space-x-2">
                  <i className="far fa-calendar-alt"></i>
                  <span className="text-sm text-blue-600">營業時間：</span>
                  <span className="text-sm font-bold">
                    星期一: {shopDetails.monday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期二: {shopDetails.tuesday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期三: {shopDetails.wednesday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期四: {shopDetails.thursday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期五: {shopDetails.friday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期六: {shopDetails.saturday},{" "}
                  </span>
                  <span className="text-sm font-bold">
                    星期日: {shopDetails.sunday}
                  </span>
                </div>

                <div className="ml-4 mt-2 flex flex-col gap-2">
                  <div className="mt-1 flex justify-start space-x-2">
                    <i className="fa-solid fa-location-dot h-[15px] w-[14px] text-sm "></i>
                    <span className="text-sm">地址: {shopDetails.address}</span>
                  </div>
                  <div className="mt-1 flex justify-start space-x-2">
                    <i className="fa-solid fa-phone icon text-sm"></i>
                    <span className="text-sm">電話: {shopDetails.phone}</span>
                  </div>
                </div>
              </div>
              <div className="w-full px-2">
                <hr className="border-1 border-blue mt-2 flex-grow border-b" />
              </div>
              <div className="w-full p-4 ">
                {categories
                  .slice()
                  .reverse()
                  .map((category) => (
                    <div key={category} className="">
                      <h2 className="my-4 ml-2 flex items-center rounded-full p-2 text-center text-3xl font-semibold underline">
                        {category}
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        {filterMealsByCategory(category).map((meal: Meal) => (
                          <div
                            key={meal.id}
                            className="w-100 flex flex-row rounded-lg bg-white p-4 shadow-lg"
                          >
                            <img
                              className="h-48 w-48 self-center rounded-lg object-cover"
                              src={meal.image}
                              alt="Meal"
                            />
                            <div className="ml-6 mt-2 flex w-full flex-col items-start md:w-1/2">
                              <h3 className="break-words pb-2 text-2xl font-semibold">
                                {meal.name}
                              </h3>
                              <span className="font-bold text-gray-900">
                                ${meal.price}
                              </span>
                              <p className="mt-5 text-gray-600">
                                {meal.description}
                              </p>
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
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopBuyerPage;
