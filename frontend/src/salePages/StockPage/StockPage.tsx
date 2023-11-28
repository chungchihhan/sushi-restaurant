import React, { useState, ChangeEvent } from "react";

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
      i === index ? { ...item, stock: Number(value) } : item
    );

    setMealData(updatedMealData);
  };

  return (
    <>
      <div className="title-center userinfo-content rounded-lg bg-info p-10 flex flex-col font-bold ">
        <label className="text-2xl pr-20 font-bold mb-4 p-3 w-60 self-center rounded-lg text-center ">餐點庫存設定</label>
        <div className="flex rounded-md top-20 pt-5 pl-60 gap-20 ">
        <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">餐點分類</label>
        <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">餐點名稱</label>
        <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">品項金額</label>
        <label className="text-2xl font-bold mb-4 p-3 w-40 self-center rounded-lg text-center bg-slate-200">庫存量</label>
        </div>
        <div>
        {mealData.map((meal,index) => (
         <div className={`order ${
          index % 2 === 0 ? "gray-background" : ""
        } flex rounded-md top-20 pt-5 pl-60 bg-info `}
        key={index}>
          <div className="mb-4 flex flex-row gap-20 top-20" key={index}>
              <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">{meal.category}</div>
              <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">{meal.meal}</div>
              <div className="meal rounded-md p-5 w-40 text-center bg-white font-bold">{meal.cost}</div>
              <div className="">
                <input
                  type="number"
                  placeholder="輸入庫存"
                  className="w-40 border rounded-md text-center p-5 font-bold"
                  value={meal.stock}
                  onChange={(e) => handleChange(e, index)}
                  readOnly={!isEditing}
                />
              </div>
          </div>
        </div>  
        ))}
        <button
          className="rounded-md bg-slate-500 hover:bg-slate-400 text-white p-10 left-50"
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
