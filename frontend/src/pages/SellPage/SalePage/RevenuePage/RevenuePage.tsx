import React, { useState, useEffect } from "react";
import axios from "axios";

interface MealData {
  meal: string;
  number: number;
  cost: number;
  revenue: number;
}

const RevenuePage = () => {
  const [mealData, setMealData] = useState<MealData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const fetchRevenueData = async () => {
    try {
      const shopId = "your_shop_id"; // Replace with actual shop ID
      const response = await axios.get(`/api/shop/${shopId}/revenue`);
      const detailsResponse = await axios.get(`/api/shop/${shopId}/revenue/details`);
      
      // Assuming the API returns an array of meal data
      setMealData(detailsResponse.data);
      setTotalRevenue(response.data.totalRevenue); // Update according to your API response structure
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []); 

  return (
    <>
      <div className="title-center userinfo-content flex flex-col rounded-lg bg-info p-10 font-bold ">
        <label className="mb-4 w-60 self-center rounded-lg p-3 pr-20 text-center text-2xl font-bold ">
          月結營收
        </label>
        <div className="top-20 flex gap-20 rounded-md pl-60 pt-5 ">
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
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } top-20 flex rounded-md bg-info pl-60 pt-5 `}
              key={index}
            >
              <div className="top-20 mb-4 flex flex-row gap-20" key={index}>
                {/* Display meal info */}
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.meal}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.number}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.cost}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.revenue}
                </div>
                {/* Increment revenue button */}
              </div>
            </div>
          ))}
          <div className="total-revenue-div">Total Revenue: {totalRevenue}</div>
        </div>
      </div>
    </>
  );
};

export default RevenuePage;
