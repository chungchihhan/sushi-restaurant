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
    initialMealData.reduce((acc, meal) => acc + meal.revenue, 0)
  );

  const calculateRevenue = (number:number, cost:number) => {
    return number * cost; // Calculate revenue by multiplying number and cost
  };

  useEffect(() => {
    const updatedMealData = mealData.map((item) => ({
      ...item,
      revenue: calculateRevenue(item.number, item.cost),
    }));
    setMealData(updatedMealData);
    setTotalRevenue(
      updatedMealData.reduce((acc, meal) => acc + meal.revenue, 0)
    );
  }, []);

  return (
    <>
      <div className="title-center userinfo-content rounded-lg bg-info p-10 flex flex-col font-bold ">
        <label className="text-2xl pr-20 font-bold mb-4 p-3 w-60 self-center rounded-lg text-center ">
          月結營收
        </label>
        <div className="flex rounded-md top-20 pt-5 pl-60 gap-20 ">
            <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">餐點名稱</label>
            <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">餐點數量</label>
            <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">品項單價</label>
            <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">品項營收</label>
        </div>
        <div>
          {mealData.map((meal, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } flex rounded-md top-20 pt-5 pl-60 bg-info `}
              key={index}
            >
              <div className="mb-4 flex flex-row gap-20 top-20" key={index}>
                {/* Display meal info */}
                <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">
                  {meal.meal}
                </div>
                <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">
                  {meal.number}
                </div>
                <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">
                  {meal.cost}
                </div>
                <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">
                  {meal.revenue}
                </div>
                {/* Increment revenue button */}
              </div>
            </div>
          ))}
          <div className="total-revenue-div">
            Total Revenue: {totalRevenue}
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenuePage;
