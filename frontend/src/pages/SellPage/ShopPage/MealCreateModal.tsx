import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";

import {
  createMeal,
  UploadImageForMeal,
  GetImageForMeal,
} from "../../../utils/client";

interface MealFormData {
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  name: string;
  active: boolean;
  shop_id: string;
}

interface MealCreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onMealCreated: () => void;
}

export default function MealCreateModal({
  isOpen,
  onRequestClose,
  onMealCreated,
}: MealCreateModalProps) {
  const [mealData, setMealData] = useState<MealFormData>({
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    image: "WERWER",
    name: "",
    active: true,
    shop_id: "",
  });

  const [mealImage, setMealImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    if (name === "image") {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setMealImage(file);
      }
    } else {
      setMealData({ ...mealData, [name]: value });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const shopId = localStorage.getItem("shopId") || "";
      const response = await createMeal(shopId, mealData);
      localStorage.setItem("mealId", response.data.id);
      const mealId = localStorage.getItem("mealId") || "";

      if (mealImage) {
        // console.log('mealImage', mealImage);
        const formData = new FormData();
        formData.append("imagePayload", mealImage);
        await UploadImageForMeal(shopId, mealId, formData);
        // 獲取新的圖片URL
        const imageResponse = await GetImageForMeal(shopId, mealId);
        const newImageUrl = imageResponse.data.image;

        // // 更新餐點數據
        // const updatedMealData = { ...mealData, image: newImageUrl };
        // await updateMeal(shopId, mealId, updatedMealData);
        if (newImageUrl) {
          setUploadedImageUrl(newImageUrl);
          onMealCreated();
        }
      }
    } catch (error) {
      console.error("Error creating meal", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Meal"
    >
      <div className="bg-gray-300 p-8">
        <h1 className="mb-4 text-2xl font-bold">Create Meal</h1>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input
            className="rounded border border-gray-300 p-2"
            type="text"
            name="name"
            value={mealData.name}
            onChange={handleChange}
            placeholder="Meal Name"
          />
          <input
            className="rounded border border-gray-300 p-2"
            type="text"
            name="description"
            value={mealData.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <select
            className="rounded border border-gray-300 p-2"
            name="category"
            value={mealData.category}
            onChange={handleChange}
          >
            <option value="">選擇類型</option>
            <option value="人氣精選">人氣精選</option>
            <option value="便宜划算">便宜划算</option>
            <option value="健康養生">健康養生</option>
          </select>
          <input
            className="rounded border border-gray-300 p-2"
            type="number"
            name="price"
            value={mealData.price}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            className="rounded border border-gray-300 p-2"
            type="number"
            name="quantity"
            value={mealData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
          />
          <input
            className="rounded border border-gray-300 p-2"
            type="file"
            name="image"
            onChange={handleChange}
          />
          {uploadedImageUrl && (
            <img src={uploadedImageUrl} alt="Uploaded Meal" />
          )}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Create Meal
          </button>
        </form>
      </div>
    </Modal>
  );
}
