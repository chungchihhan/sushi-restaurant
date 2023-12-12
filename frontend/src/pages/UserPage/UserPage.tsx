import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";


import { getUser } from "../../utils/client";
import { userLogin } from "../../utils/client";

interface SignInFormData {
  account: string;
  password: string;
}

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInFormData>({
    account: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await userLogin(formData);
      const token = res.data.token;
      const userId = res.data.id;
      const shopId = res.data.shop_id;
      if (shopId && shopId !== "none") {
        localStorage.setItem("shopId", shopId);
        // 可以在這裡添加導航到店鋪相關頁面的邏輯
      }

      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", userId);
        toast.success("User signed in successfully!");

        // 調用 getUser 函數
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
      setFormData({ account: "", password: "" });
    } catch (error) {
      console.error(error);
      toast.error("Error signing in.");
    }
  };

  return (
    <>
      <ToastContainer />
        <div className="flex h-screen items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="mb-4 rounded-full bg-white px-8 pb-8 pt-6 shadow-md animate__animated animate__rubberBand"
            // style={{ maxWidth: '400px' }}
          >
            <p className="flex mb-8 justify-center font-mono text-4xl font-bold animate__animated animate__heartBeat">Login</p>
            <div className="mb-4">
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="Name"
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none animate__animated animate__bounce"
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none animate__animated animate__shakeX"
              />
            </div>
            <div className="ml-20 flex justify-between">
              <button
                type="submit"
                className=" rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700  animate__animated animate__tada"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

    </>
  );
}
