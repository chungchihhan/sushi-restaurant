import { useState, useEffect, useRef } from "react";
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

type MealFormData = {
  shop_id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  active:boolean;
  id: string;
};

interface UpdatedMealData {
  // name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ShopEditPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickImage = () => {
    // When the image is clicked, trigger the file input click event
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

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
      const shopId = localStorage.getItem("shopId");
      if (shopId) {
        const mealsData = await getMealsByShopId(shopId);
        setMeals(mealsData.data as MealFormData[]);
      }
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
    // console.log("New category:", event.target.value);
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
      <div className="mx-5 mt-5 flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-300">
        <div className="w-full rounded-xl">
          {/* <h1 className="mb-6 text-center rounded-full p-5 text-4xl font-bold mt-5 bg-slate-50">Edit Shop</h1> */}
          <div className="w-full">
            <div
              onClick={handleClickImage} // Add click handler to trigger file input click
              className="h-80 w-full cursor-pointer"
            >
              {uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded Shop Image"
                  className="mt-10 h-full w-full bg-white object-cover opacity-60"
                  placeholder="Select Image"
                />
              )}
            </div>

            <input
              type="file"
              onChange={handleImageChange}
              ref={inputRef}
              className="hidden"
            />
          </div>
        </div>

        <div className="w-full rounded-xl">
          {/* <h1 className="mb-4 text-2xl font-bold">Shop Page</h1> */}
          <form
            className="flex flex-col gap-4 p-5 md:grid-cols-2 lg:grid-cols-1"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4">
              <input
                className="rounded-full border border-transparent bg-transparent p-2 text-4xl font-bold underline"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
              <div className="flex items-center gap-4">
                <label htmlFor="address" className="ml-2 text-xl">
                  地址 :
                </label>
                <input
                  className="ml-2 rounded-full border border-transparent bg-slate-200 p-2 text-xl"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  style={{ width: "fit-content" }}
                />
                <select
                  className="rounded-full border border-transparent bg-slate-100 p-2 text-xl"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  style={{ width: "fit-content", marginLeft: "10px" }}
                >
                  <option value="">選擇類型</option>
                  <option value="中式">中式</option>
                  <option value="美式">美式</option>
                  <option value="日式">日式</option>
                  <option value="韓式">韓式</option>
                  <option value="港式">港式</option>
                  <option value="飲料">飲料</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="ml-2 text-xl" htmlFor="phone">
                  電話：
                </label>
                <input
                  className="rounded-full border border-transparent bg-slate-200 p-2 text-xl"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  style={{ width: "fit-content" }}
                />
              </div>
            </div>

            {/* Category selection */}

            {/* Day toggles and time selectors */}
            <div className="md:flex-cols-1 lg:flex-cols-1 flex gap-2 md:gap-4">
              {days.map((day) => (
                <div
                  key={day}
                  className="mr-5 w-28 items-center gap-4 rounded-full p-2"
                >
                  <label className="rounded-3xl font-bold">{day}</label>
                  <input
                    className="ml-2 scale-150 transform border-transparent align-middle "
                    type="checkbox"
                    checked={formData[day] !== "本日不營業"}
                    onChange={(e) => handleDayToggle(day, e.target.checked)}
                  />
                  {formData[day] !== "本日不營業" && (
                    <div className="mt-5 flex w-28 flex-col items-center">
                      <input
                        className="mb-2 rounded-full border border-gray-300 p-2"
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
                        className="rounded-full border border-gray-300 p-2"
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

            {/* Submit button */}
            <button
              type="submit"
              className="w-full rounded-full bg-blue-500 py-2 font-bold text-white hover:bg-blue-700 md:col-span-2"
            >
              Save Changes
            </button>
          </form>
        </div>
        <div className="w-full gap-4 p-4">
          <div className="">
            <hr className="border-1 mb-5 flex-grow border-b border-black" />
            <span className="text-4xl">人氣精選</span>
          </div>
          <div>
            <button onClick={handleOpenModal}>Add Meal</button>
            <MealCreateModal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              onMealCreated={fetchMeals}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
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
      </div>

      {/* </div> */}
    </>
  );
}
