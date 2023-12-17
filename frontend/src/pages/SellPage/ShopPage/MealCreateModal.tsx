import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface ErrorResponse {
  response?: {
    data: {
      error: string;
    };
    status: number;
  };
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
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      if (mealImage) {
        const shopId = localStorage.getItem("shopId") || "";
        const response = await createMeal(shopId, mealData);
        localStorage.setItem("mealId", response.data.id);
        const mealId = localStorage.getItem("mealId") || "";

        const formData = new FormData();
        formData.append("imagePayload", mealImage);
        await UploadImageForMeal(shopId, mealId, formData);

        const imageResponse = await GetImageForMeal(shopId, mealId);
        const newImageUrl = imageResponse.data.image;

        if (newImageUrl) {
          setUploadedImageUrl(newImageUrl);
          onMealCreated();
          toast.success("Meal created successfully!");
        }
      } else {
        toast.error("Image is needed!");
      }
    } catch (error) {
      console.error("Error creating meal", error);
      const typedError = error as ErrorResponse;
      if (typedError.response?.data) {
        console.error("Error creating meal", typedError.response.data.error);
        toast.error("請填寫所有欄位");
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  const resetFormData = () => {
    setMealData({
      description: "",
      price: 0,
      quantity: 0,
      category: "",
      image: "WERWER",
      name: "",
      active: true,
      shop_id: "",
    });
    setMealImage(null);
    setUploadedImageUrl("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        resetFormData();
      }}
      className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-lg border-2 border-gray-600 bg-info font-bold"
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50"
      contentLabel="Create Meal"
    >
      <div className="max-h-[80vh] overflow-auto p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">新增餐點</h1>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <div>餐點名稱:</div>
              <input
                className="flex-grow rounded border border-gray-300 p-2"
                type="text"
                name="name"
                value={mealData.name}
                onChange={handleChange}
                placeholder="名稱"
              />
            </div>
            <div className="flex items-center gap-5">
              <div>餐點標籤:</div>
              <input
                className="flex-grow rounded border border-gray-300 p-2"
                type="text"
                name="category"
                value={mealData.category}
                onChange={handleChange}
                placeholder="輸入餐點標籤"
              ></input>
            </div>
            <div className="flex items-center gap-5">
              <div>餐點價錢:</div>
              <input
                className="flex-grow rounded border border-gray-300 p-2"
                type="number"
                name="price"
                value={mealData.price}
                onChange={handleChange}
                placeholder="價錢"
              />
            </div>
            <div className="flex items-center gap-5">
              <div>餐點庫存:</div>
              <input
                className="flex-grow rounded border border-gray-300 p-2"
                type="number"
                name="quantity"
                value={mealData.quantity}
                onChange={handleChange}
                placeholder="庫存"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <div>餐點描述:</div>
              <textarea
                className="min-h-[220px] flex-grow rounded border border-gray-300 p-2 text-lg"
                name="description"
                value={mealData.description}
                onChange={handleChange}
                placeholder="描述"
              />
            </div>
          </div>

          <div>
            <div className="col-span-2">
              <input
                className="w-full rounded-md border border-gray-300 p-1 file:rounded file:border-0 file:bg-gray-400 file:px-4 file:py-2 file:text-white hover:bg-gray-100 "
                type="file"
                name="image"
                onChange={handleChange}
              />
              {uploadedImageUrl && (
                <img
                  className="mt-4 rounded-lg"
                  src={uploadedImageUrl}
                  alt="Uploaded Meal"
                />
              )}
            </div>
            <button
              type="submit"
              className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              儲存新增餐點
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Modal>
  );
}
