import React, { useState } from "react";
import type { ChangeEvent } from "react";

const initialMealData = [
  {
    category: "人氣推薦",
    meal: "炙燒壽司",
    cost: 100,
    stock: 100,
  },
  {
    category: "人氣推薦",
    meal: "炙燒壽司",
    cost: 100,
    stock: 90,
  },
];

const StockPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [mealData, setMealData] = useState(initialMealData);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    const updatedMealData = mealData.map((item, i) =>
      i === index ? { ...item, stock: Number(value) } : item,
    );

    setMealData(updatedMealData);
  };

  return (
    <>
      <div className="title-center userinfo-content flex flex-col rounded-lg bg-info p-10 font-bold ">
        <label className="mb-4 w-60 self-center rounded-lg p-3 pr-20 text-center text-2xl font-bold ">
          餐點庫存設定
        </label>
        <div className="top-20 flex gap-20 rounded-md pl-60 pt-5 ">
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            餐點分類
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            餐點名稱
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            品項金額
          </label>
          <label className="mb-4 w-40 self-center rounded-lg bg-slate-200 p-3 text-center text-2xl font-bold">
            庫存量
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
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.category}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.meal}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.cost}
                </div>
                <div className="">
                  <input
                    type="number"
                    placeholder="輸入庫存"
                    className="w-40 rounded-md border p-5 text-center font-bold"
                    value={meal.stock}
                    onChange={(e) => handleChange(e, index)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="left-50 rounded-md bg-slate-500 p-10 text-white hover:bg-slate-400"
            onClick={handleToggleEdit}
          >
            {isEditing ? "確認" : "編輯"}
          </button>
        </div>
      </div>
    </>
  );
};

export default StockPage;
