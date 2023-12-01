import React, { useState, useEffect } from "react";

const initialMealData = [
  {
    meal: "炙燒壽司",
    number: 100,
    cost: 900,
    revenue: 10000,
  },
  {
    meal: "炙燒壽司",
    number: 100,
    cost: 100,
    revenue: 10000,
  },
];

const RevenuePage = () => {
  const [mealData, setMealData] = useState(initialMealData);
  const [totalRevenue, setTotalRevenue] = useState(
    initialMealData.reduce((acc, meal) => acc + meal.revenue, 0),
  );

  const calculateRevenue = (number: number, cost: number) => {
    return number * cost; // Calculate revenue by multiplying number and cost
  };

  useEffect(() => {
    const updatedMealData = mealData.map((item) => ({
      ...item,
      revenue: calculateRevenue(item.number, item.cost),
    }));
    setMealData(updatedMealData);
    setTotalRevenue(
      updatedMealData.reduce((acc, meal) => acc + meal.revenue, 0),
    );
  }, [mealData]); // 加入 mealData 作為依賴

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
