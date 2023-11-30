import { useState, ChangeEvent, useEffect } from "react";
// import { getUser } from "../../utils/client";
import { createShop } from "../../utils/client";
import { useNavigate } from "react-router-dom";


interface UserFormData{
  user_id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  category: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  [key: string]: any; // 允許動態鍵
}

export default function ShopPage(){
  const navigate=useNavigate();

  const [formData, setFormData] = useState<UserFormData>({
    user_id: "",
    name: "",
    address: "",
    phone: "",
    image: "",
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

  const handleTimeChange = (day: string, openTime: string, closeTime: string) => {
    setFormData({ ...formData, [day]: `${openTime}-${closeTime}` });
  };

  const handleDayToggle = (day: string, isOpen: boolean) => {
    setFormData({ ...formData, [day]: isOpen ? "08:00-17:00" : "本日不營業" }); // 預設時間可以根據需要調整
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log('Sending formData:', formData);
      const res = await createShop(formData);
      console.log(res)
      navigate("/shopedit")
    } catch (error) {
      console.error("Error creating a shop", error);
    }
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Shop Page</h1>
      <form className="grid gap-4">
        {Object.keys(formData).filter(key => !days.includes(key)).map((key) => (
          <input
            key={key}
            className="p-2 border border-gray-300 rounded"
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleInputChange}
            placeholder={key}
          />
        ))}

        {days.map(day => (
          <div key={day} className="flex items-center">
            <label className="mr-2">
              {day}:
            </label>
            <input 
              className="mr-2"
              type="checkbox" 
              checked={formData[day] !== "本日不營業"} 
              onChange={(e) => handleDayToggle(day, e.target.checked)} 
            />
            {formData[day] !== "本日不營業" && (
              <div className="flex">
                <input 
                  className="p-2 border border-gray-300 rounded mr-2"
                  type="time" 
                  value={formData[day].split('-')[0]} 
                  onChange={(e) => handleTimeChange(day, e.target.value, formData[day].split('-')[1])} 
                />
                <input 
                  className="p-2 border border-gray-300 rounded"
                  type="time" 
                  value={formData[day].split('-')[1]} 
                  onChange={(e) => handleTimeChange(day, formData[day].split('-')[0], e.target.value)} 
                />
              </div>
            )}
          </div>
        ))}

        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
