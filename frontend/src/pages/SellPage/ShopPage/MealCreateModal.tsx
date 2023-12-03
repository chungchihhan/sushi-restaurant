import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";
import { createMeal, UploadImageForMeal, GetImageForMeal} from "../../../utils/client";

interface MealFormData {
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  name: string;
  shop_id: string;
}

interface MealCreateModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onMealCreated: () => void
}

export default function MealCreateModal({ isOpen, onRequestClose ,onMealCreated}: MealCreateModalProps) {
  const [mealData, setMealData] = useState<MealFormData>({
    description: '',
    price: 0,
    quantity: 0,
    category: '',
    image: 'WERWER',
    name: '',
    shop_id: "",
  });

  const [mealImage, setMealImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      console.log('Meal created', response);
      localStorage.setItem("mealId", response.data.id);
      const mealId = localStorage.getItem("mealId") || "";

      if (mealImage) {
        // console.log('mealImage', mealImage);
        const formData = new FormData();
        formData.append('imagePayload', mealImage);
        const res = await UploadImageForMeal(shopId, mealId, formData);
        // 獲取新的圖片URL
        const imageResponse = await GetImageForMeal(shopId, mealId);
        const newImageUrl = imageResponse.data.image;
        
        // // 更新餐點數據
        // const updatedMealData = { ...mealData, image: newImageUrl };
        // await updateMeal(shopId, mealId, updatedMealData);
        if (newImageUrl) {
          setUploadedImageUrl(newImageUrl);
          onMealCreated()
        }
      }

    } catch (error) {
      console.error('Error creating meal', error);
    }
  };


    return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create Meal">
        <div className="p-8 bg-gray-300">
          <h1 className="text-2xl font-bold mb-4">Create Meal</h1>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <input
              className="p-2 border border-gray-300 rounded"
              type="text"
              name="name"
              value={mealData.name}
              onChange={handleChange}
              placeholder="Meal Name"
            />
            <input
              className="p-2 border border-gray-300 rounded"
              type="text"
              name="description"
              value={mealData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <select
                className="p-2 border border-gray-300 rounded"
                name="category"
                value={mealData.category}
                onChange={handleChange}
                >
                <option value="">選擇類型</option>
                <option value="中式">中式</option>
                <option value="西式">西式</option>
                <option value="美式">美式</option>
            </select>
            <input
              className="p-2 border border-gray-300 rounded"
              type="number"
              name="price"
              value={mealData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <input
              className="p-2 border border-gray-300 rounded"
              type="number"
              name="quantity"
              value={mealData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
            />
            <input
                className="p-2 border border-gray-300 rounded"
                type="file"
                name="image"
                onChange={handleChange}
            />
            {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded Meal" />}
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Meal
            </button>
          </form>
        </div>
      </Modal>
      );
    }
