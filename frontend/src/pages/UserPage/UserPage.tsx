import React, { useState, ChangeEvent } from "react";

const UserPage = () => {
  // 初始資料
  const initialData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    birthday: "1990-01-01",
    employeeId: "E12345",
    defaultAddress: "123 Main St, City",
  };

  // 使用狀態來管理編輯狀態和資料
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);

  // 處理 input 變化
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 處理編輯/確認按鈕點擊
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);

    // 如果是確認狀態，更新資料
    if (!isEditing) {
      // 在這裡使用 updateUserData 方法來更新資料
      // 假設 updateUserData 是一個更新資料的函數，你需要實現它
      // updateUserData(formData);
    }
  };

  return (
    <>
      <div className="userinfo-overlay flex min-h-screen items-center justify-center">
        <div className="userinfo-content max-w-md rounded-lg bg-info p-4 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">個人資料設定</h1>
          <div className="mb-4 flex">
            <div className="left-side flex-grow pr-4">
              <div className="userinfo-row mb-4">
                <label className="mr-2">名稱</label>
                <input
                  type="text"
                  placeholder="輸入名稱"
                  className="w-full border p-2"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="userinfo-row mb-4">
                <label className="mr-2">Email</label>
                <input
                  type="text"
                  placeholder="輸入Email"
                  className="w-full border p-2"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="userinfo-row mb-4">
                <label className="mr-2">手機</label>
                <input
                  type="text"
                  placeholder="輸入手機"
                  className="w-full border p-2"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="userinfo-row mb-4">
                <label className="mr-2">生日</label>
                <input
                  type="text"
                  placeholder="輸入生日"
                  className="w-full border p-2"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="userinfo-row mb-4">
                <label className="mr-2">工號</label>
                <input
                  type="text"
                  placeholder="輸入工號"
                  className="w-full border p-2"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="userinfo-row mb-4">
                <label className="mr-2">預設地址</label>
                <input
                  type="text"
                  placeholder="輸入預設地址"
                  className="w-full border p-2"
                  name="defaultAddress"
                  value={formData.defaultAddress}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="right-side w-2/3">
              <div className="info-box text-center">
                <h2 className="mb-2 text-xl font-semibold">當月累積消費金額</h2>
                <p className="text-lg">100000</p>
              </div>
            </div>
          </div>
          <button
            className="user-confirm-button mt-4 w-full rounded-md bg-blue-500 p-2 text-white"
            onClick={handleToggleEdit}
          >
            {isEditing ? "確認" : "編輯"}
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPage;

// import React, { useState } from 'react';
// import useUser from '../hooks/useUser'; // 替換成實際的 useUser 路徑

// const UserPage = () => {
//   const {
//     user,
//     loading,
//     fetchUser,
//     updateUser,
//   } = useUser();

//   const [formData, setFormData] = useState({
//     email: '',
//     phone: '',
//     birthday: '',
//   });

//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleConfirm = async () => {
//     try {
//       await updateUser(formData);
//       await fetchUser();

//       setFormData({
//         email: '',
//         phone: '',
//         birthday: '',
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <>
//       <div className="userinfo-overlay">
//         <div className="userinfo-content">
//           <h1>個人資料設定</h1>
//           <div className="left-side">
//             {/* 省略其他表單欄位 */}
//             <div className="userinfo-row">
//               <label>Email</label>
//               <input
//                 type="text"
//                 placeholder="輸入Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="userinfo-row">
//               <label>手機</label>
//               <input
//                 type="text"
//                 placeholder="輸入手機"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="userinfo-row">
//               <label>生日</label>
//               <input
//                 type="text"
//                 placeholder="輸入生日"
//                 name="birthday"
//                 value={formData.birthday}
//                 onChange={handleChange}
//               />
//             </div>
//             {/* 省略其他表單欄位 */}
//           </div>
//           <div className="right-side">
//             {/* 省略其他顯示區域 */}
//           </div>
//           <button
//             className="user-confirm-button"
//             onClick={handleConfirm}
//             disabled={loading}
//           >
//             {loading ? '更新中...' : '確認'}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserPage;
