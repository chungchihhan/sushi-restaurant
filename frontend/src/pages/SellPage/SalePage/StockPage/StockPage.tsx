import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import { updateMeal, getMealsByShopId } from "../../../../utils/client";
import type { GetMealsResponse, UpdateMealPayload } from "@lib/shared_types";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;
const shopId = localStorage.getItem("shopId");

const StockPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [mealData, setMealData] = useState<GetMealsResponse>([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        if (!shopId) return;
        const res = await getMealsByShopId(shopId);
        setMealData(res.data);
      } catch (error) {
        toast.error("Error fetching orders");
      }
    };

    if (isAuthenticated) {
      fetchStock();
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        if (!shopId) return;

        const updatedMeals: { id: string; mealData: UpdateMealPayload }[] =
          mealData.map((meal) => {
            const { id, ...rest } = meal;
            return { id, mealData: rest };
          });

        updatedMeals.map(async ({ id, mealData }) => {
          try {
            const res = await updateMeal(shopId, id, mealData);
            return res.data;
          } catch (error) {
            toast.error(`Error updating meal with ID ${id}`);
            throw error;
          }
        });

        toast.success(`Updated successfully !`);
      } catch (error) {
        toast.error("Error updating meals");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChangePrice = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;

    const updatedMealData = mealData.map((item, i) =>
      i === index ? { ...item, price: Number(value) } : item,
    );

    setMealData(updatedMealData);
  };

  const handleChangeQuantity = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;

    const updatedMealData = mealData.map((item, i) =>
      i === index ? { ...item, quantity: Number(value) } : item,
    );

    setMealData(updatedMealData);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center px-24 py-8">
        <div className="title-center userinfo-content w-full justify-between rounded-lg bg-info p-10 font-bold shadow-lg">
          <label className="mb-4 flex justify-center self-center p-3 text-center text-4xl font-bold">
            餐點庫存設定
          </label>
          <div className="flex gap-4 rounded-md bg-info p-2 ">
            <div className="elf-center mb-4 w-1/4 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              餐點分類
            </div>
            <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              餐點名稱
            </div>
            <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              品項金額
            </div>
            <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              庫存量
            </div>
          </div>
          {mealData.map((meal, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } flex gap-4 rounded-md bg-info p-2`}
              key={index}
            >
              <div className="w-1/4 rounded-lg bg-white p-3 text-center font-bold">
                {meal.category}
              </div>
              <div className="w-1/4 rounded-lg bg-white p-3 text-center font-bold">
                {meal.name}
              </div>
              <div className="w-1/4">
                <input
                  type="number"
                  placeholder="輸入金額"
                  className={`w-full rounded-lg border p-3 text-center font-bold ${
                    isEditing
                      ? "border-2 border-black hover:bg-blue-200"
                      : "bg-white"
                  }`}
                  value={meal.price}
                  onChange={(e) => handleChangePrice(e, index)}
                  readOnly={!isEditing}
                />
              </div>
              <div className="w-1/4">
                <input
                  type="number"
                  placeholder="輸入庫存"
                  className={`w-full rounded-lg border p-3 text-center font-bold ${
                    isEditing
                      ? "border-2 border-black hover:bg-blue-200"
                      : "bg-white"
                  }`}
                  value={meal.quantity}
                  onChange={(e) => handleChangeQuantity(e, index)}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          ))}
          <div className="mt-2 flex justify-center self-center p-3 text-center text-2xl font-bold">
            <button
              className={`w-1/4 self-center rounded-3xl p-3 ${
                isEditing ? "bg-brand" : "bg-slate-600"
              } text-white hover:bg-slate-400`}
              onClick={handleToggleEdit}
            >
              {isEditing ? "確定" : "編輯"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockPage;
