import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userLogin } from "../../utils/client";
import { useNavigate } from 'react-router-dom';

interface SignInFormData {
  account: string;
  password: string;
}


export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInFormData>({ account: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log(formData);
      const res = await userLogin(formData);
      console.log('User signed in successfully!');
      // Assuming the token is in the response

      // const token = localStorage.getItem('userToken');
      const token = res.data.token;
      const userId = res.data.id;
      console.log(token)
      if (token) {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);
        toast.success("User signed in successfully!");
        // navigate(`/menu/${userId}`);
        navigate("/");

      } else {
        toast.error("No token received.");
      }
      // Reset formData
      setFormData({ account: '', password: '' });

    } catch (error) {
      console.error(error);
      toast.error("Error signing in.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <input
              type="text"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="Name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
