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
    <div className="bg-gray-300  p-8">
      <h1 className="mb-4 text-2xl font-bold">Shop Page</h1>
      <form className="grid gap-4">
        {Object.keys(formData)
          .filter((key) => !days.includes(key) && key !== "category")
          .map((key) => (
            <input
              key={key}
              className="rounded border border-gray-300 p-2"
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              placeholder={key}
            />
          ))}
        <select
          className="rounded border border-gray-300 p-2"
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
        >
          <option value="">選擇類型</option>
          <option value="中式">中式</option>
          <option value="美式">美式</option>
          <option value="日式">日式</option>
          <option value="韓式">韓式</option>
          <option value="港式">港式</option>
          <option value="飲料">飲料</option>
        </select>
        {days.map((day) => (
          <div key={day} className="flex items-center">
            <label className="mr-2">{day}:</label>
            <input
              className="mr-2"
              type="checkbox"
              checked={formData[day] !== "本日不營業"}
              onChange={(e) => handleDayToggle(day, e.target.checked)}
            />
            {formData[day] !== "本日不營業" && (
              <div className="flex">
                <input
                  className="mr-2 rounded border border-gray-300 p-2"
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
                  className="rounded border border-gray-300 p-2"
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
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
