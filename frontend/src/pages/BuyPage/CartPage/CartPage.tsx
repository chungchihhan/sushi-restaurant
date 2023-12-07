// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { getOrdersByUserId } from "../../../utils/client";
// import type { UserOrderHistoryData } from "@lib/shared_types";

// const userId = localStorage.getItem("userId");
// const token = localStorage.getItem("userToken");
// const isAuthenticated = token && userId;

// const CartPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<UserOrderHistoryData[]>([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         if (!id) return;
//         const res = await getOrdersByUserId(id);
//         setOrders(res.data);
//       } catch (error) {
//         toast.error("Error fetching orders");
//       }
//     };

//     if (isAuthenticated) {
//       fetchOrders();
//     } else {
//       navigate("/signin");
//     }
//   }, [id, navigate]);

//   return (
//     <>
//       <div className="order-record-overlay rounded-md p-8">
//         <div className="order-record-content  grid gap-4 rounded-md bg-white p-20">
//           {orders.filter((order) => order.status === "cart").map((order, index) => (
//             <div
//               className={`order ${
//                 index % 2 === 0 ? "gray-background" : ""
//               } flex h-80 rounded-md bg-info px-40 pt-5 `}
//               key={index}
//             >
//               <div className="w-100 relative rounded-md">
//                 <div className="tags">
//                   <label className="md:font-bold">店名：</label>
//                   <div className="store-tag relative rounded-md bg-white p-2 pr-20">
//                     {order.shop_name}
//                   </div>
//                 </div>

//                 <label className="md:font-bold">餐點：</label>
//                 <div className="meal-tag">
//                   <div className="meal relative rounded-md bg-white p-2 pr-20">
//                     {order.order_id}
//                   </div>
//                 </div>

//                 <label className="md:font-bold">數量：</label>
//                 <div className="number relative rounded-md bg-white p-2 pr-20">
//                   <select className="number-dropdown w-20">
//                     <option className="number-list" value="1">
//                       {" "}
//                       1{" "}
//                     </option>
//                     <option className="number-list" value="2">
//                       {" "}
//                       2{" "}
//                     </option>
//                     <option className="number-list" value="3">
//                       {" "}
//                       3{" "}
//                     </option>
//                     <option className="number-list" value="4">
//                       {" "}
//                       4{" "}
//                     </option>
//                   </select>
//                 </div>

//                 <label className="md:font-bold">金額：</label>
//                 <div className="cost-tag relative rounded-md bg-white p-2 pr-20">
//                   <div className="cost">${order.order_price}</div>
//                 </div>
//               </div>

//               <label className="relative left-20 md:font-bold">備註：</label>
//               <div className="relative left-20 top-10 ">
//                 <textarea
//                   className="
//                       form-control
//                       m-0
//                       block
//                       w-full
//                       rounded-md
//                       border
//                       border-solid
//                       border-gray-300
//                       bg-white bg-clip-padding
//                       px-10 py-20 text-base
//                       font-normal
//                       text-gray-700
//                       transition
//                       ease-in-out
//                       focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none
//                     "
//                   id="exampleFormControlTextarea1"
//                   placeholder="輸入備註"
//                 ></textarea>
//               </div>

//               <div className=" relative left-40 top-2 h-60 rounded-md bg-indigo-300 lg:w-60 ">
//                 <img src={order.shop_image} alt="" className="objet-none rounded-md" />
//               </div>

//               <button className="del-button relative left-48 top-28 h-20 rounded-md bg-slate-500  font-bold text-white hover:bg-slate-400 lg:w-24 ">
//                 刪除
//               </button>
//             </div>
//           ))}
//           <button className="shop-button rounded-md bg-slate-300 font-bold text-white hover:bg-blue-500 lg:w-72 ">
//             繼續選購
//           </button>
//           {/* <button className="correct-button  bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md " onClick={handleSubmit}>確認下單</button> */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartPage;

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrdersByUserId } from "../../../utils/client";
import type { UserOrderHistoryData } from "@lib/shared_types";

import CartItem from "./_components/CartItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

type OrderItem = {
  meal_id: string,
  meal_name: string,
  quantity: number,
  price: number,
  remark: string,
};

type Order = {
  id: string,
  user_id: string, 
  shop_id: string,
  order_items: OrderItem[],
  shopname: "藏壽司",
  total_price: number,
  image: string,
};

const order: Order[] = [
  {
    id: "255effa8d8504561820bf97e",
    user_id: "6566fab5cdc62179a7d5d321", 
    shop_id: "6566fab5cdc62179a7d5d323",
    order_items: [
      { meal_id: "255e1fa8d8504561820bf97e", meal_name: '炙燒鮭魚', quantity: 2 , price: 100, remark: "不要辣！"},
      { meal_id: "255e1f2bd8504561820bf97e", meal_name: '炙燒起司鮭魚', quantity: 1, price: 50, remark: "哈囉，今天過得好嗎？" },
    ],
    shopname: "藏壽司",
    total_price: 250,
    image: "https://i.imgur.com/z1nZbH9.jpg"
  },
  {
    id: "255effa8d8504561820bf97e",
    user_id: "6566fab5cdc62179a7d5d321", 
    shop_id: "6566fab5cdc62179a7d5d323",
    order_items: [
      { meal_id: "255e1fa8d8504561820bf97e", meal_name: '炙燒鮭魚', quantity: 2 , price: 100, remark: "不要辣！"},
      { meal_id: "255e1fa8d8504561820bf97e", meal_name: '炙燒鮭魚', quantity: 2 , price: 100, remark: "不要辣！"}
    ],
    shopname: "藏壽司",
    total_price: 250,
    image: "https://i.imgur.com/z1nZbH9.jpg"
  }
];

const CartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState<UserOrderHistoryData[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) return;
        const res = await getOrdersByUserId(userId);
        setCart(res.data);
      } catch (error) {
        toast.error("Error fetching cart");
      }
    };

    if (isAuthenticated) {
      fetchCart();
    } else {
      navigate("/signin");
    }
  }, [id, navigate]);

  const filterCart = cart.filter((order) => order.status === "cart");

  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content grid gap-4">
          {order.map((order: Order) => (
            <CartItem
              key={order.id}
              user_id={order.user_id}
              shop_id={order.shop_id}
              shop_name={order.shopname}
              order_price={order.total_price}
              shop_image={order.image}
              order_items={order.order_items}
            />
          ))}
        </div>
        <Link
          className="view-details-button rounded-full bg-slate-300 font-bold text-white hover:bg-blue-500 px-4 py-2 m-4 font-bold"
          to={`/meal/`}
        >
          {filterCart.length === 0 ? "去點餐 ！": "繼續選購"}
        </Link>
      </div>
    </>
  );
};

export default CartPage;
