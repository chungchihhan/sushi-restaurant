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
  const [password, setPassword] = useState<string>("");
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
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

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const toggleEditPassword = () => {
    setIsEditingPassword(!isEditingPassword);
    // Reset password field when switching back to show mode
    if (isEditingPassword) {
      setPassword("");
    }
  };

  const handleSubmit = async () => {
    if (password.length > 0 && password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      if (password.length >= 8) {
        formData.password = password;
      }
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

  return (
    <>
      <ToastContainer />
      <div className="mx-auto max-w-2xl rounded-lg bg-gray-300 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit User</h1>
        <div className="flex flex-col gap-10">
          <div className="flex justify-between">
            <form className="space-y-4">
              {/* Role */}
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
                  htmlFor="role"
                >
                  身分
                </label>
                <div>{formData.role}</div>
              </div>
              {/* Account */}
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
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
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
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
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
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
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="flex items-center">
                  {isEditingPassword ? (
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="rounded-lg p-2"
                    />
                  ) : (
                    <div className="w-52 rounded-lg p-2">
                      {formData.password ? "••••••••" : ""}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={toggleEditPassword}
                    className="ml-2 rounded-md px-2 py-1 text-sm text-white"
                  >
                    {isEditingPassword ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>

              {/* Birthday */}
              <div className="flex items-center gap-2">
                <label
                  className="block w-20 text-sm font-medium text-gray-700"
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
                  className="rounded-lg p-2"
                />
              </div>
            </form>

            <div className="mr-20">
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
