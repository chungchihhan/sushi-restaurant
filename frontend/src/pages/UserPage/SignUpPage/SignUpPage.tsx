import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { createUser, userLogin, getUser } from "../../../utils/client";

import "./_components/SignUpInfo.css";

interface FormData {
  account: string;
  password: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  birthday: string;
}

interface ErrorResponse {
  response?: {
    data: {
      error: string;
    };
    status: number;
  };
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    account: "",
    password: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    birthday: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createUser(formData);

      const loginData = {
        account: formData.account,
        password: formData.password,
      };

      const res = await userLogin(loginData);
      // toast.success("User created and signed in successfully!");

      const token = res.data.token;
      const userId = res.data.id;
      const shopId = res.data.shop_id;
      if (shopId && shopId !== "none") {
        localStorage.setItem("shopId", shopId);
      }

      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", userId);

        const userResponse = await getUser(userId, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userResponse && userResponse.data) {
          localStorage.setItem("userRole", userResponse.data.role);
          localStorage.setItem("username", userResponse.data.username);
        }

        navigate("/");
        window.location.reload();
      } else {
        toast.error("No token received.");
      }

      setFormData({
        account: "",
        password: "",
        username: "",
        email: "",
        phone: "",
        role: "",
        birthday: new Date().toISOString().split("T")[0],
      });
      navigate("/");
    } catch (error) {
      const typedError = error as ErrorResponse;
      if (typedError.response?.data) {
        toast.error("請填寫所有欄位");
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="signup-big-container flex items-center justify-center">
        <form onSubmit={handleSubmit} className="signup-small-container">
          <div className="">
            <span className="mb-2 block text-center text-3xl font-bold text-black">
              食客/商店 註冊
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-32 font-bold">工號/商號:</div>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="工號/商號"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-32 font-bold">使用者名稱:</div>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="使用者名稱"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-32 font-bold">密碼:</div>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="密碼"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-32 font-bold">信箱:</div>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="信箱"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex w-32 font-bold">電話:</div>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="電話"
            />
          </div>
          <div className="flex gap-5 self-start">
            <div className="flex w-20 items-center font-bold">身分:</div>
            <select
              className="focus:shadow-outline w-36 rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">選擇身分</option>
              <option value="店家">店家</option>
              <option value="食客">食客</option>
            </select>
          </div>
          <div className="flex gap-5 self-start">
            <div className="flex w-20 items-center font-bold">生日:</div>
            <input
              className="focus:shadow-outline w-36 appearance-none rounded border px-3 py-2 font-bold leading-tight text-gray-700 shadow focus:outline-none"
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3 flex items-center justify-center">
            <button
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              確認
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
