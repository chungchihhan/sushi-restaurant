import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createShop } from "../../../utils/client";

interface UserFormData {
  // user_id: string;
  name: string;
  address: string;
  phone: string;
  // image: string;
  category: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  [key: string]: string;
}
export default function ShopPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>({
    // user_id: "",
    name: "",
    address: "",
    phone: "",
    // image: "",
    category: "",
    monday: "本日不營業",
    tuesday: "本日不營業",
    wednesday: "本日不營業",
    thursday: "本日不營業",
    friday: "本日不營業",
    saturday: "本日不營業",
    sunday: "本日不營業",
  });
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category: event.target.value });
  };
  const handleTimeChange = (
    day: string,
    openTime: string,
    closeTime: string,
  ) => {
    setFormData({ ...formData, [day]: `${openTime}-${closeTime}` });
  };
  const handleDayToggle = (day: string, isOpen: boolean) => {
    setFormData({ ...formData, [day]: isOpen ? "08:00-17:00" : "本日不營業" });
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID is not available");
        return;
      }
      const completeFormData = {
        ...formData,
        user_id: userId,
        image: formData.image,
      };
      const res = await createShop(completeFormData);
      localStorage.setItem("shopId", res.data.id);
      navigate("/shopedit");
    } catch (error) {
      console.error("Error creating a shop", error);
    }
  };
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="mx-20 mt-5 items-center gap-2 rounded-lg bg-info p-8 font-bold">
      <h1 className="mb-4 text-3xl">
        <i className="fas fa-edit mr-2"></i>
        建立你的商店
      </h1>
      <form className="flex-col gap-4">
        <div>
          {Object.keys(formData)
            .filter((key) => !days.includes(key) && key !== "category")
            .map((key) => (
              <input
                key={key}
                className="my-4 flex w-3/5 rounded-full border border-transparent bg-slate-200 p-2 text-lg font-bold"
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                placeholder={
                  key === "name"
                    ? "商店名稱"
                    : key === "address"
                      ? "地址"
                      : "電話"
                }
              />
            ))}
          <select
            className="my-4 flex w-3/5 rounded-full border border-transparent bg-slate-200 p-2 text-lg font-bold"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
          >
            <option value="" className="font-bold">
              選擇類型
            </option>
            <option value="中式" className="font-bold">
              中式
            </option>
            <option value="美式" className="font-bold">
              美式
            </option>
            <option value="日式" className="font-bold">
              日式
            </option>
            <option value="韓式" className="font-bold">
              韓式
            </option>
            <option value="港式" className="font-bold">
              港式
            </option>
            <option value="飲料" className="font-bold">
              飲料
            </option>
          </select>
        </div>
        <div className="flex w-full flex-wrap justify-between text-xl">
          {days.map((day) => (
            <div
              key={day}
              className="flex w-28 flex-col items-center gap-2 p-2"
            >
              <div className="flex">
                <label className="mr-2">
                  {day === "monday"
                    ? "星期一"
                    : day === "tuesday"
                      ? "星期二"
                      : day === "wednesday"
                        ? "星期三"
                        : day === "thursday"
                          ? "星期四"
                          : day === "friday"
                            ? "星期五"
                            : day === "saturday"
                              ? "星期六"
                              : "星期日"}
                  :
                </label>
                <input
                  className="scale-150"
                  type="checkbox"
                  checked={formData[day] !== "本日不營業"}
                  onChange={(e) => handleDayToggle(day, e.target.checked)}
                />
              </div>
              {formData[day] !== "本日不營業" && (
                <div className="flex flex-col">
                  <input
                    className="scale-90 rounded-full border border-gray-300 p-2"
                    type="time"
                    value={formData[day].split("-")[0]}
                    onChange={(e) =>
                      handleTimeChange(
                        day,
                        e.target.value,
                        formData[day].split("-")[1],
                      )
                    }
                  />
                  <input
                    className="scale-90 rounded-full border border-gray-300 p-2"
                    type="time"
                    value={formData[day].split("-")[1]}
                    onChange={(e) =>
                      handleTimeChange(
                        day,
                        formData[day].split("-")[0],
                        e.target.value,
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            className="w-full rounded-full bg-blue-500 py-2 font-bold text-white hover:bg-blue-700 md:col-span-2"
            onClick={handleSubmit}
          >
            儲存變更
          </button>
        </div>
      </form>
    </div>
  );
}
