import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRevenue } from "../../../../utils/client";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  meal_name: string;
  quantity: number;
  meal_price: number;
  sum_price: number;
}

export default function RevenuePage(): JSX.Element {
  const navigate = useNavigate();
  const [mealData, setMealData] = useState<OrderItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      // try {
      //   const token = localStorage.getItem("shopToken");
      //   const shopId = localStorage.getItem("shopId");
      //   if (token && shopId) {
      //     const config = {
      //       headers: { Authorization: `Bearer ${token}` },
      //     };


      //     const response = await getRevenue(shopId);
      //     console.log(response.data);


      //     const processedData = response.data.flatMap((item: { order_items: OrderItem[] }) => item.order_items);
          
      //     setMealData(processedData); 

      //     const total = processedData.reduce(
      //       (acc: number, meal: OrderItem) => acc + meal.sum_price,
      //       0
      //     );
      //     setTotalRevenue(total); 
      //   }
      // } catch (error) {
      //   console.error(error);
      //   toast.error("Error fetching revenue.");
      // }
      const response = await getRevenue("656ddc8b3d2ed61787d032b5");
      console.log(response);
    };

    fetchRevenue();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="title-center userinfo-content flex flex-col rounded-lg bg-info p-10 font-bold">
        <label className="mb-4 w-60 self-center rounded-lg p-3 pr-20 text-center text-2xl font-bold ">
          月結營收
        </label>
        <div className="top-20 flex gap-20 rounded-md pl-60 pt-5">
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            餐點名稱
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            餐點數量
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            品項單價
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            品項營收
          </label>
        </div>
        <div>
          {mealData.map((meal, index) => (
            <div
              className={`order ${index % 2 === 0 ? "gray-background" : ""} top-20 flex rounded-md bg-info pl-60 pt-5`}
              key={index}
            >
              <div className="top-20 mb-4 flex flex-row gap-20" key={index}>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.meal_name}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.quantity}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.meal_price}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.sum_price}
                </div>
              </div>
            </div>
          ))}
          <div className="total-revenue-div">Total Revenue: {totalRevenue}</div>
        </div>
      </div>
    </>
  );
}
