import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";

import { getUser, editUser, getBalance } from "../../utils/client";

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

  const [balance, setBalance] = useState<number>(0);
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
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const userId = localStorage.getItem("userId");
    // Assuming you have a way to get the year and month
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    if (userId) {
      try {
        const res = await getBalance(userId, year, month);
        setBalance(res.data.balance);
      } catch (error) {
        console.error("Error fetching balance", error);
      }
    }
  };

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

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function getFormFieldValue(key: keyof UserFormData) {
    return formData[key];
  }

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-2xl rounded-lg bg-gray-300 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit User</h1>
        <div className="flex flex-col gap-10">
          <div className="flex">
            <form className="space-y-4">
              {/* Role */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="role"
                >
                  身分
                </label>
                <div>{formData.role}</div>
              </div>
              {/* Account */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="account"
                >
                  Account
                </label>
                <input
                  id="account"
                  type="text"
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  placeholder="account"
                  className="rounded-lg p-2"
                />
              </div>

              {/* Username */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="username"
                  className="rounded-lg p-2"
                />
              </div>
              
              {/* Email */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email"
                  className="rounded-lg p-2"
                />
              </div>
              {/* Password */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              
              {/* Birthday */}
              <div className="gap-2 flex items-center">
                <label
                  className="block text-sm font-medium text-gray-700 w-20"
                  htmlFor="birthday"
                >
                  Birthday
                </label>
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="rounded-lg p-2 w-52"
                />
              </div>
            </form>
          
            <div className="items-center">
              <h2 className="text-lg font-semibold">Your Balance:</h2>
              <p className="text-4xl">$ {balance.toFixed(1)}</p>
            </div>
          </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full rounded-md bg-teal-700 px-4 py-2 font-semibold text-white shadow hover:bg-teal-800"
            >
              Save Changes
            </button>
        </div>

      </div>
    </>
  );
}
