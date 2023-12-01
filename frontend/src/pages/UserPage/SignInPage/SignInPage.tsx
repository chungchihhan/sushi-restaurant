import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { userLogin } from "../../../utils/client";

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
      // console.log(formData);
      const res = await userLogin(formData);
      // console.log('User signed in successfully!');
      // Assuming the token is in the response

      // const token = localStorage.getItem('userToken');
      const token = res.data.token;
      const userId = res.data.id;

      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userId", userId);
        toast.success("User signed in successfully!");
        navigate("/");
      } else {
        toast.error("No token received.");
      }
      // Reset formData
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
          className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
        >
          <div className="mb-4">
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="Name"
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
