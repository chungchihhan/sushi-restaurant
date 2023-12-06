import React, { useState, useEffect } from "react";

const initialMealData = [
  {
    shop_name: "藏壽司",
    meal: "炙燒壽司",
    number: 100,
    meal_price: 900,
    sum_price: 10000,
  },
  {
    shop_name: "藏壽司",
    meal: "炙燒壽司",
    number: 100,
    meal_price: 900,
    sum_price: 10000,
  },
];

const CartDetailPage = () => {
  const [mealData, setMealData] = useState(initialMealData);
  const [totalRevenue, setTotalRevenue] = useState(
    initialMealData.reduce((acc, meal) => acc + meal.sum_price, 0),
  );

  const calculateRevenue = (number: number, meal_price: number) => {
    return number * meal_price; // Calculate revenue by multiplying number and cost
  };

  useEffect(() => {
    const updatedMealData = mealData.map((item) => ({
      ...item,
      revenue: calculateRevenue(item.number, item.meal_price),
    }));
    setMealData(updatedMealData);
    setTotalRevenue(
      updatedMealData.reduce((acc, meal) => acc + meal.sum_price, 0),
    );
  }, [mealData]); // 加入 mealData 作為依賴

  return (
    <>
      <div className="max-md mx-auto mt-10 rounded-lg bg-slate-300 p-4  shadow">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="ml-4 rounded-lg bg-white p-3 text-2xl font-bold">
              訂單編號XXXXXXXXXXXX
            </h1>
          </div>
          <div className=" flex flex-row gap-20 text-right">
            <h2 className="rounded-lg bg-slate-200 px-4 py-2 text-center text-2xl font-bold">
              訂單 11/02 pm 1:30
            </h2>
            <select className="bg-info text-lg font-bold outline-none ">
              <option
                className="bg-transparent text-lg font-bold"
                value="default"
              >
                取餐方式
              </option>
              <option className="bg-transparent text-lg font-bold" value="自取">
                自取
              </option>
              <option
                className="bg-transparent text-lg font-bold"
                value="定點取餐"
              >
                定點取餐
              </option>
            </select>
          </div>
        </div>
        <div className="border-b border-t py-4">
          <div className="mb-2 ml-5 flex items-center justify-between">
            <span className="text-lg font-bold">店名</span>
            <span className="text-lg font-bold">品名</span>
            <div className="flex items-center">
              <span className="text-lg font-bold">單價</span>
              <span className="mx-2 font-bold">x</span>
              <span className="text-lg font-bold">數量</span>
              <span className="mx-2 font-bold">=</span>
              <span className="text-lg font-bold">金額</span>
            </div>
          </div>
          {mealData.map((meal, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } top-20 rounded-md pt-5 `}
              key={index}
            >
              <div className="top-20 mb-4 flex-row gap-20" key={index}>
                {/* Display meal info */}
                <div className="gap-30 ml-5 flex items-center justify-between">
                  <span className="text-sm">{meal.shop_name}</span>
                  <span className="mr-3 text-sm">{meal.meal}</span>
                  <div className="flex items-center">
                    <span className="text-sm">{meal.meal_price}</span>
                    <span className="mx-2">x</span>
                    <span className="text-sm">{meal.number}</span>
                    <span className="mx-2">=</span>
                    <span className="text-sm font-bold">{meal.sum_price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="mb-2 mt-4">
            <textarea
              className="ml-1 w-full rounded border p-2 text-sm"
              rows={3}
              placeholder="備註：不要辣！"
            ></textarea>
          </div>
          <hr className="ridge border" />
          <div className="mb-4 mt-5 flex items-center justify-between">
            <span className="text-2xl font-bold">總金額：</span>
            <span className="text-2xl font-bold">$ {totalRevenue}</span>
          </div>
          <div className="mt-10 flex justify-between">
            <button className="rounded bg-gray-400 px-6 py-4 text-sm hover:bg-gray-300">
              取消下單
            </button>
            <button className="rounded bg-blue-500  px-10 py-4 text-sm text-white hover:bg-blue-400">
              確認下單
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetailPage;
