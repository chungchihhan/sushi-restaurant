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
      <div className="signup-big-container">
        <form onSubmit={handleSubmit}>
          <div className="signup-small-container">
            <div>
              <span className="titlename">食客註冊</span>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="account"
                value={formData.account}
                onChange={handleChange}
                placeholder="工號"
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="使用者名稱"
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="input-container">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>
            <div className="input-container">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="abc"
              >
                <option value="">Select Role</option>
                <option value="店家">店家</option>
                <option value="食客">食客</option>
              </select>
            </div>
            <div className="input-container">
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit">確認</button>
          </div>
        </form>
      </div>
    </>
  );
}
