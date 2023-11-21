import React, { useState } from "react";

// import { createUser } from '@/utils/client';
import { createUser } from "../../utils/client";

// import axios from 'axios';
import "./_components/SignUpInfo.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  birthday: string; // Changed to string
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    birthday: new Date().toISOString().split("T")[0], // Set current date in YYYY-MM-DD format
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await createUser(formData);
      console.log(response);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        birthday: new Date().toISOString().split("T")[0], // Reset to current date
      });
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <>
      <div className="signup-big-container">
        <form onSubmit={handleSubmit}>
          <div className="signup-small-container">
            <div>
              <span className="titlename">食客註冊</span>
            </div>
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="工號"
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