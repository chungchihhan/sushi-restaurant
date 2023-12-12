import { useState, useEffect } from "react";
import { getRevenue ,getRevenueDetails} from "../../../../utils/client";

interface MealData {
  mealName: string;
  number: number;
}


const RevenuePage = () => {
  const [mealData, setMealData] = useState<MealData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [year, setYear] = useState<number>(new Date().getFullYear()); 
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);


  const fetchRevenueData = async () => {
    try {
      const shopId = localStorage.getItem("shopId") || "";
      const response = await getRevenue(shopId, year, month);
      const detailsResponse = await getRevenueDetails(shopId,year, month);
  
      const mealSalesData = detailsResponse.data.mealSales;
      const transformedMealData = Object.keys(mealSalesData).map(mealName => ({
        mealName: mealName,
        number: mealSalesData[mealName],
        // price: mealSalesData[mealPrice],
        // mealRevenue: mealSalesData[mealRevenue],
      }));
  
      setMealData(transformedMealData);
      setTotalRevenue(response.data.balance);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMonth = parseInt(e.target.value);
    newMonth = newMonth % 12;
    newMonth = newMonth < 0 ? 12 + newMonth : newMonth; // Adjust for negative numbers
    newMonth = newMonth === 0 ? 12 : newMonth; // Convert 0 to 12
    setMonth(newMonth);
  };
  

  useEffect(() => {
    fetchRevenueData();
  }, [year,month]); 

  return (
    <>
      <div className="title-center userinfo-content flex flex-col rounded-lg bg-info p-10 font-bold ">
        <label className="mb-4 w-60 self-center rounded-lg p-3 pr-20 text-center text-2xl font-bold ">
          月結營收
        </label>
        <div className="self-center">
          <div>欲查詢年分</div>
          <input
            type="number" 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))} 
            placeholder="Year"
          />
          <div>月份</div>
          <input
            type="number" 
            value={month} 
            onChange={handleMonthChange} 
            placeholder="Month"
          />
        </div>
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
                  {meal.mealName}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.number}
                </div>
                {/* <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.price}
                </div>
                <div className="meal w-40 rounded-md bg-white p-5 text-center font-bold">
                  {meal.mealRevenue}
                </div> */}
                {/* Increment revenue button */}
              </div>
            </div>
          ))}
          <div>
            Total Revenue: {totalRevenue}
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenuePage;
