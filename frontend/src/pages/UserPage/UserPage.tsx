import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import { getUser, editUser } from "../../utils/client";

interface UserFormData {
  account: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  birthday: string;
  password: string;
}

export default function UserPage() {
  const [formData, setFormData] = useState<UserFormData>({
    account: "",
    username: "",
    email: "",
    phone: "",
    role: "",
    birthday: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const res = await getUser(userId, config);
          const transformedData: UserFormData = {
            account: res.data.account,
            username: res.data.username,
            email: res.data.email,
            phone: res.data.phone,
            role: res.data.role,
            birthday: res.data.birthday,
            password: res.data.password,
          };
          setFormData(transformedData);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching user data", error.message);
        }
      }
    };
    fetchUserData();
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
        await editUser(userId, formData, config);
        toast.success("User updated successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error updating user", error.message); // 使用 console.error
      }
      toast.error("Error updating user.");
    }
  };

  const roles = ["店家", "食客"];

  function getFormFieldValue(key: keyof UserFormData) {
    return formData[key];
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
              {key === "role" ? (
                <select
                  id={key}
                  name={key}
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : key === "birthday" ? (
                <input
                  id={key}
                  type="date"
                  name={key}
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              ) : (
                <input
                  id={key}
                  type="text"
                  name={key}
                  value={getFormFieldValue(key as keyof UserFormData)}
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