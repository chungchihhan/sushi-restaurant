import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getUser } from "../../../utils/client";
import { userLogin } from "../../../utils/client";
import "animate.css";

interface SignInFormData {
  account: string;
  password: string;
}

interface ErrorResponse {
  response?: {
    data: {
      error: string;
    };
    status: number;
  };
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
      const typedError = error as ErrorResponse;
      if (typedError.response?.data) {
        toast.error(typedError.response.data.error);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="signup-big-container">
        <form
          onSubmit={handleSubmit}
          className="animate__animated animate__rubberBand"
        >
          <div className="signup-small-container">
            <div>
              <span className="titlename animate__animated animate__heartBeat">
                登入
              </span>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="工號/商號"
                className="animate__animated animate__bounce"
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="密碼"
                className="animate__animated animate__shakeX"
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="animate__animated animate__tada">
              確認
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
