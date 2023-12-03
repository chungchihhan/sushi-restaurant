import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import { getShop, editShop } from "../../../utils/client";

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
}

export default function ShopEditPage() {
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

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");
        const shopId = localStorage.getItem("shopId");
        console.log(shopId);

      // 檢查 shopId 是否為 null
        if (shopId === null) {
          console.error("Shop ID is null");
          // 在這裡可以添加更多的錯誤處理邏輯
          return;
        }
        console.log(shopId);

        const res = await getShop(shopId);
        console.log(res);

        // if (token && userId && shopId) {
        //   const config = {
        //     headers: { Authorization: `Bearer ${token}` },
        //   };
        //   const res = await getShop(shopId);
        //   console.log(res);
        //   const transformedData: ShopFormData = {
        //     user_id: res.data.user_id,
        //     name: res.data.name,
        //     address: res.data.address,
        //     phone: res.data.phone,
        //     image: res.data.image,
        //     category: res.data.category,
        //     monday: res.data.monday,
        //     tuesday: res.data.tuesday,
        //     wednesday: res.data.wednesday,
        //     thursday: res.data.thursday,
        //     friday: res.data.friday,
        //     saturday: res.data.saturday,
        //     sunday: res.data.sunday,
        //   };
        //   setFormData(transformedData);
        // }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching shop data", error.message);
        }
      }
    };
    fetchShopData();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        // 移除了 console.log
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await editShop(userId, formData, config);
        toast.success("Shop updated successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating shop", error.message); // 使用 console.error
      }
      toast.error("Error updating shop.");
    }
  };

  const roles = ["中式", "西式","美式"];

  function getFormFieldValue(key: keyof ShopFormData) {
    return formData[key] || '';
  }

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-2xl rounded-lg bg-gray-300 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit User</h1>

        <form className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label
                className="block text-sm font-medium capitalize text-gray-700"
                htmlFor={key}
              >
                {key}
              </label>
              {key === "category" ? (
                <select
                  id={key}
                  name={key}
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (key === "monday" || key === "tuesday" || key === "wednesday" || key === "thursday" || key === "friday" || key === "saturday" || key === "sunday") ? (
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={getFormFieldValue(key as keyof ShopFormData)}
                  onChange={handleInputChange}
                  placeholder={`${key} open and end time`}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              ) : (
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={getFormFieldValue(key as keyof ShopFormData)}
                  onChange={handleInputChange}
                  placeholder={key}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full rounded-md bg-teal-700 px-4 py-2 font-semibold text-white shadow hover:bg-teal-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
