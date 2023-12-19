import { useState, useEffect } from "react";

import { getRevenue, getRevenueDetails } from "../../../../utils/client";

interface MealData {
  meal_name: string;
  meal_price: number;
  quantity: number;
  revenue: number;
}

const RevenuePage = () => {
  const [mealData, setMealData] = useState<MealData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMonth = parseInt(e.target.value);
    newMonth = newMonth % 12;
    newMonth = newMonth < 0 ? 12 + newMonth : newMonth;
    newMonth = newMonth === 0 ? 12 : newMonth;
    setMonth(newMonth);
  };

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const shopId = localStorage.getItem("shopId") || "";
        const response = await getRevenue(shopId, year, month);
        const detailsResponse = await getRevenueDetails(shopId, year, month);

        const mealDetails: MealData[] = detailsResponse.data.mealDetails;
        const transformedMealData = mealDetails.map((detail) => ({
          meal_name: detail.meal_name,
          meal_price: detail.meal_price,
          quantity: detail.quantity,
          revenue: detail.revenue,
        }));

        setMealData(transformedMealData);
        setTotalRevenue(response.data.balance);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };
    fetchRevenueData();
  }, [year, month]);

  return (
    <div className="flex items-center justify-center px-24 py-8">
      <div className="title-center userinfo-content w-full justify-between rounded-lg bg-info p-10 font-bold shadow-lg">
        <label className="flex justify-center self-center p-3 text-center text-4xl font-bold">
          月結營收
        </label>
        <div className="mb-4 flex gap-4 self-center">
          <div className="m-2 w-1/6 text-xl font-bold">
            <span className="ml-1">欲查詢年分</span>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              placeholder="Year"
              className="w-full rounded-lg border p-3 text-center font-bold"
            />
          </div>
          <div className="m-2 w-1/6 text-xl font-bold">
            <span className="ml-1">月份</span>
            <input
              type="number"
              value={month}
              onChange={handleMonthChange}
              placeholder="Month"
              className="w-full rounded-lg border p-3 text-center font-bold"
            />
          </div>
        </div>
        <div className="flex gap-4 rounded-md bg-info p-2 ">
          <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
            餐點名稱
          </div>
          <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
            餐點數量
          </div>
          <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
            品項金額
          </div>
          <div className="mb-4 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
            品項營收
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
              {meal.meal_name}
            </div>
            <div className="w-1/4 rounded-lg bg-white p-3 text-center font-bold">
              {meal.quantity}
            </div>
            <div className="w-1/4 rounded-lg bg-white p-3 text-center font-bold">
              {meal.meal_price}
            </div>
            <div className="w-1/4 rounded-lg bg-white p-3 text-center font-bold">
              {meal.revenue}
            </div>
          </div>
        ))}
        <hr className="my-2 h-px border-0 dark:bg-slate-700"></hr>
        <div className="flex items-center justify-end gap-4 rounded-lg p-2 text-center text-2xl font-bold">
          總營收:
          <span className="underline">${totalRevenue}</span>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
