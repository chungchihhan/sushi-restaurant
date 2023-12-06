import React, { useState, useEffect } from "react";

const initialMealData = [
  {
    shop_name:"藏壽司",
    meal: "炙燒壽司",
    number: 100,
    meal_price: 900,
    sum_price: 10000,
  },
  {
    shop_name:"藏壽司",
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
       <div className="max-md mx-auto bg-slate-300 p-4 mt-10 rounded-lg  shadow">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl bg-white rounded-lg p-3 ml-4 font-bold">訂單編號XXXXXXXXXXXX</h1>
                </div>
                <div className=" flex flex-row text-right gap-20">
                    <h2 className="text-2xl px-4 py-2 text-center bg-slate-200 rounded-lg font-bold">
                        訂單 11/02  pm 1:30 
                    </h2>
                    <select className="text-lg font-bold outline-none bg-info ">
                            <option className="text-lg font-bold bg-transparent" value="default">取餐方式</option>
                            <option className="text-lg font-bold bg-transparent" value="自取">自取</option>
                            <option className="text-lg font-bold bg-transparent" value="定點取餐">定點取餐</option>
                    </select>
                </div>
            </div>
            <div className="border-t border-b py-4">
                <div className="ml-5 flex justify-between items-center mb-2">
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
              key={index}>
              <div className="top-20 mb-4 flex-row gap-20" key={index}>
                {/* Display meal info */}
                <div className="ml-5 flex justify-between gap-30 items-center">
                    <span className="text-sm">{meal.shop_name}</span>
                    <span className="text-sm mr-3">{meal.meal}</span>
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
           <div className="mt-4 mb-2">
                <textarea className="w-full p-2 ml-1 text-sm border rounded" rows={3} placeholder="備註：不要辣！"></textarea>
            </div>
            <hr className="border ridge"/>
            <div className="flex justify-between items-center mb-4 mt-5">
                <span className="text-2xl font-bold">總金額：</span>
                <span className="text-2xl font-bold">$ {totalRevenue}</span>
            </div>
            <div className="flex justify-between mt-10">
                <button className="bg-gray-400 hover:bg-gray-300 text-sm px-6 py-4 rounded">取消下單</button>
                <button className="bg-blue-500 hover:bg-blue-400  text-white text-sm px-10 py-4 rounded">確認下單</button>
            </div>
        </div>
      </div>
    </>
  );
};

export default CartDetailPage;