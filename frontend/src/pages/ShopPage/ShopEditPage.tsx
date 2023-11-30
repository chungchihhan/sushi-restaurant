import { useState, ChangeEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getShop } from "../../utils/client";
import { editShop } from "../../utils/client";
import { ToastContainer, toast } from 'react-toastify';

interface UserFormData{
  user_id: string;
  name: string;
  address: string;
  phone: string;
  image: string;
  category: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  [key: string]: any;
}

export default function ShopEditPage(){

  const [formData, setFormData] = useState<UserFormData>({
    user_id: "",
    name: "",
    address: "",
    phone: "",
    image: "",
    category: "",
    monday: "本日不營業",
    tuesday: "本日不營業",
    wednesday: "本日不營業",
    thursday: "本日不營業",
    friday: "本日不營業",
    saturday: "本日不營業",
    sunday: "本日不營業",
  });

  const { userId } = useParams();
  
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {      
  //       const token = localStorage.getItem('userToken');
  //       if (token && userId) {
  //         const config = {
  //           headers: { 'Authorization': `Bearer ${token}` }
  //         };
  //         const res = await getShop(userId);
  //         console.log(res)
  //         const transformedData: UserFormData = {
  //           account: res.data.account,
  //           username: res.data.username,
  //           email: res.data.email,
  //           phone: res.data.phone,
  //           role: res.data.role,
  //           birthday: res.data.birthday,
  //           password:res.data.password,
  //         };
  //         setFormData(transformedData);
  //       }
  //     }
  //     catch(error){
  //       console.log("Error fetching user data", error);
  //     }
  //   };
  //   fetchUserData();
  // }, [userId]);

  // const handleInputChange = (event: ChangeEvent<HTMLInputElement| HTMLSelectElement>) => {
  //   setFormData({ ...formData, [event.target.name]: event.target.value });
  // };

  // const handleSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem('userToken');
  //     if (token && userId) {
  //       console.log('Sending formData:', formData);
  //       const config = {
  //         headers: { 'Authorization': `Bearer ${token}` }
  //       };
  //       const response = await editUser(userId, formData, config);
  //       toast.success("User updated successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error updating user", error);
  //     toast.error("Error updating user.");
  //   }
  // };

  // const roles = ['店家', '食客'];

  return (
    <>
    <h1>hello</h1>
      {/* <ToastContainer />
      <div className="max-w-2xl mx-auto p-8 bg-gray-300 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Edit User</h1>

        <form className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize" htmlFor={key}>
                {key}
              </label>
              {key === 'role' ? (
                <select
                id={key}
                name={key}
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                    ))}
                </select>
              ) : key === 'birthday' ? (
                <input
                id={key}
                type="date"
                name={key}
                value={formData.birthday}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                ) : (
                  <input
                  id={key}
                  type="text"
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleInputChange}
                  placeholder={key}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              )}
            </div>
          ))}
          <button 
            type="button"
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-md shadow"
            >
            Save Changes
          </button>
        </form>
      </div> */}
    </>
  );
}
