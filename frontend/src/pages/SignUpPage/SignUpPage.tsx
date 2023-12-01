import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { createUser } from '@/utils/client';
import { createUser } from "../../utils/client";

// import axios from 'axios';
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
      // console.log(formData);
      // const res = await createUser(formData);
      // console.log(res);
      await createUser(formData);

      toast.success("User created successfully!");
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
      console.error(error);
      toast.error("Error creating user.");
    }
  };

  return (
    <>
      <ToastContainer />
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
