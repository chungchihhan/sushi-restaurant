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
  password?: string;
}

const userRole = localStorage.getItem("userRole");

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
    if (isEditingPassword && (password.length === 0 || password.length < 8)) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    try {
      const token = localStorage.getItem("userToken");
      const userId = localStorage.getItem("userId");
      if (token && userId) {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // 創建要提交的資料副本
        const updatedData = { ...formData };

        // 如果用戶修改了密碼，則加入新密碼
        if (isEditingPassword && password.length >= 8) {
          updatedData.password = password;
        } else {
          // 如果未修改密碼，則從提交資料中移除密碼欄位
          delete updatedData.password;
        }

        await editUser(userId, updatedData, config);
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
        <h1 className="mb-6 text-center text-3xl font-bold">編輯使用者資訊</h1>
        <div className="flex flex-col gap-10 font-bold">
          <div className="flex justify-between gap-6">
            <form className="space-y-4">
              {/* Role */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="role"
                >
                  身分:
                </label>
                <div>{formData.role}</div>
              </div>
              {/* Account */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="account"
                >
                  {userRole === "店家" ? "商號：" : "工號："}
                </label>
                <input
                  id="account"
                  type="text"
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  placeholder={userRole === "店家" ? "商號" : "工號"}
                  className="rounded-lg p-2"
                />
              </div>

              {/* Username */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="username"
                >
                  名稱:
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="名稱"
                  className="rounded-lg p-2"
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="email"
                >
                  信箱:
                </label>
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="信箱"
                  className="rounded-lg p-2"
                />
              </div>
              {/* Password */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="password"
                >
                  密碼:
                </label>

                <div className="flex w-full items-center pl-4">
                  {isEditingPassword ? (
                    <div className="flex">
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="rounded-lg p-2"
                        placeholder="密碼"
                      />
                      <button
                        type="button"
                        onClick={toggleEditPassword}
                        className="ml-4 flex items-center rounded-lg bg-slate-400 px-3 py-1 text-center text-sm text-white hover:bg-slate-500"
                      >
                        {isEditingPassword ? "取消" : "編輯"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-52 gap-4 rounded-lg p-2">
                      {formData.password ? "••••••••" : ""}
                      <button
                        type="button"
                        onClick={toggleEditPassword}
                        className="ml-4 flex items-center rounded-lg bg-slate-400 px-2 py-1 text-center text-sm text-white hover:bg-slate-500"
                      >
                        {isEditingPassword ? "取消" : "編輯"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Birthday */}
              <div className="flex items-center gap-3">
                <label
                  className="block w-20 text-lg font-bold text-gray-700"
                  htmlFor="birthday"
                >
                  生日:
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

            <div className="mr-20 flex flex-col self-center">
              {userRole == "食客" && (
                <>
                  <h2 className="text-lg font-bold">你的月結餐費:</h2>
                  <p className="text-4xl">$ {balance.toFixed(1)}</p>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center rounded-md bg-teal-700 px-4 py-2 text-center font-semibold text-white shadow hover:bg-teal-800"
          >
            儲存
          </button>
        </div>
      </div>
    </>
  );
}
