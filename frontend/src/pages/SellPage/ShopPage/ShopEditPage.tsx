import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  getShop,
  editShop,
  UploadImageForShop,
  GetImageForShop,
  updateMeal,
  getMealsByShopId,
  deleteMeal,
} from "../../../utils/client";

import MealCreateModal from "./MealCreateModal";
import MealDetail from "./MealDetail";

interface ShopFormData {
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
  [key: string]: string;
}

type MealFormData = {
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  // createdAt: string;
  // updatedAt: string;
  id: string;
};

interface UpdatedMealData {
  // name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ShopEditPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<ShopFormData>({
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
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const [meals, setMeals] = useState<MealFormData[]>([]);
  const fetchShopData = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const shopId = localStorage.getItem("shopId");
      // console.log(shopId);

      // 檢查 shopId 是否為 null
      if (shopId === null) {
        console.error("Shop ID is null");
        // 在這裡可以添加更多的錯誤處理邏輯
        return;
      }

      const response = await GetImageForShop(shopId);
      if (response.data.image) {
        setUploadedImageUrl(response.data.image); // Set the image URL if it exists
      }

      if (token && userId && shopId) {
        const res = await getShop(shopId);
        // console.log(res);
        const transformedData: ShopFormData = {
          user_id: res.data.user_id,
          name: res.data.name,
          address: res.data.address,
          phone: res.data.phone,
          image: res.data.image,
          category: res.data.category,
          monday: res.data.monday,
          tuesday: res.data.tuesday,
          wednesday: res.data.wednesday,
          thursday: res.data.thursday,
          friday: res.data.friday,
          saturday: res.data.saturday,
          sunday: res.data.sunday,
        };
        setFormData(transformedData);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching shop data", error.message);
      }
    }
  };

  const fetchMeals = async () => {
    try {
      // localStorage.setItem("shopId","656c173a7c2af88779d401da");
      const shopId = localStorage.getItem("shopId");
      if (shopId) {
        const mealsData = await getMealsByShopId(shopId);
        // console.log(123)
        setMeals(mealsData.data as MealFormData[]);
      }
      // const mealsData = await getMealsByShopId("656c173a7c2af88779d401da")
      // setMeals(mealsData.data as MealFormData[]);
    } catch (error) {
      console.error("Error fetching meals", error);
    }
  };

  useEffect(() => {
    fetchShopData();
    fetchMeals();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageUpload = async (imageFile: File) => {
    const shopId = localStorage.getItem("shopId");
    if (shopId) {
      try {
        const formData = new FormData();
        formData.append("imagePayload", imageFile);

        // Upload image
        await UploadImageForShop(shopId, formData);

        // Fetch the newly uploaded image URL
        const response = await GetImageForShop(shopId);
        const imageUrl = response.data.image;
        setUploadedImageUrl(imageUrl);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image", error);
        toast.error("Error uploading image.");
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const imageFile = target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(imageFile);

      handleImageUpload(imageFile);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    // await uploadImage();
    // console.log(123)
    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      const shopId = localStorage.getItem("shopId");
      if (token && userId && shopId) {
        // 移除了 console.log
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // console.log('Form Data before editShop:', formData);
        await editShop(shopId, formData, config);
        toast.success("Shop updated successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating shop", error.message); // 使用 console.error
      }
      toast.error("Error updating shop.");
    }
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
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // const getMealIdByName = (name:string) => {
  //   const key = `${name}_mealId`;
  //   return localStorage.getItem(key);
  // }

  const updateMealData = async (
    updatedMeal: UpdatedMealData,
    mealId: string,
  ) => {
    try {
      const shopId = localStorage.getItem("shopId") || "";
      await updateMeal(shopId, mealId, updatedMeal);
      fetchMeals(); // 重新獲取餐點資料以更新 UI
      toast.success("Meal updated successfully!");
    } catch (error) {
      console.error("Error updating meal", error);
      toast.error("Error updating meal.");
    }
  };
  // Add this function inside the ShopEditPage component
  const handleDeleteMeal = async (mealId: string) => {
    try {
      const shopId = localStorage.getItem("shopId");
      if (shopId) {
        await deleteMeal(shopId, mealId);
        toast.success("Meal deleted successfully!");
        fetchMeals(); // Refresh the meal list
      }
    } catch (error) {
      console.error("Error deleting meal", error);
      toast.error("Error deleting meal.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-2xl rounded-lg bg-gray-300 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit User</h1>
        {uploadedImageUrl && (
          <div className="mb-4">
            <img
              src={uploadedImageUrl}
              alt="Uploaded Shop Image"
              className="h-auto w-full"
            />
          </div>
        )}
        <input
          type="file"
          onChange={handleImageChange}
          className="mb-4 block w-full text-sm text-gray-500
          file:mr-4 file:rounded-full file:border-0
          file:bg-teal-700 file:px-5 file:py-2
          file:text-sm file:font-semibold file:text-white
          hover:file:bg-teal-800"
        />
      </div>
      <div className="bg-gray-300 p-8">
        <h1 className="mb-4 text-2xl font-bold">Shop Page</h1>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Render non-day fields */}
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

          {/* Category selection */}
          <select
            className="rounded border border-gray-300 p-2"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
          >
            <option value="">選擇類型</option>
            <option value="中式">中式</option>
            <option value="西式">西式</option>
            <option value="美式">美式</option>
          </select>

          {/* Day toggles and time selectors */}
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

          {/* Submit button */}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
      <div className="felx-col flex items-center gap-4 p-4">
        <text className="text-4xl">人氣精選</text>
        <div>
          <button onClick={handleOpenModal}>Add Meal</button>
          <MealCreateModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onMealCreated={fetchMeals}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {meals.map((meal) => (
          <MealDetail
            key={meal.id}
            mealId={meal.id}
            image={meal.image}
            name={meal.name}
            price={meal.price}
            quantity={meal.quantity}
            category={meal.category}
            description={meal.description}
            onUpdate={(updatedMeal) => updateMealData(updatedMeal, meal.id)}
            onDelete={handleDeleteMeal}
          />
        ))}
      </div>
    </>
  );
}
