import React from "react";

// import './OrderRecord.css';

const orders = [
  {
    store: "藏壽司",
    meal: "炙燒壽司",
    cost: 100,
    img: "/menu_1_img.jpg",
  },
  {
    store: "游壽司",
    meal: "蛙式壽司",
    cost: 90,
    img: "/menu_2_img.jpg",
  },
  // {
  //   store: "壽司狼",
  //   meal: "wolf",
  //   cost: 80,
  //   img: '/menufood_1_img.jpg',
  // },
  // Add more orders as needed
];

const CartPage = () => {
  return (
    <>
      

      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content  rounded-md grid gap-4 bg-white p-20">
          {orders.map((order, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } flex rounded-md h-80 pt-5 bg-info px-40 `}
              key={index}
            >
              <div className="relative rounded-md w-100">
                
                <div className="tags">
                  <label className="md:font-bold">店名：</label>
                  <div className="store-tag relative rounded-md p-2 pr-20 bg-white">{order.store}</div>
                </div>

                <label className="md:font-bold">餐點：</label>
                <div className="meal-tag">
                  <div className="meal relative rounded-md p-2 pr-20 bg-white">{order.meal}</div>
                </div>

                <label className="md:font-bold">數量：</label>
                <div className="number relative rounded-md p-2 pr-20 bg-white">
                    <select className="number-dropdown w-20">
                      <option className="number-list" value="1"> 1 </option>
                      <option className="number-list" value="2"> 2 </option>
                      <option className="number-list" value="3"> 3 </option>
                      <option className="number-list" value="4"> 4 </option>
                    </select>
                </div>

                <label className="md:font-bold">金額：</label>
                <div className="cost-tag relative rounded-md p-2 pr-20 bg-white">
                  <div className="cost">${order.cost}</div>
                </div>

                </div>
              
                <label className="relative left-20 md:font-bold">備註：</label>
              <div className="relative left-20 top-10 ">
              <textarea
                    className="
                      form-control
                      block
                      w-full
                      px-10
                      py-20
                      text-base
                      font-normal
                      text-gray-700
                      bg-white bg-clip-padding
                      border border-solid border-gray-300
                      rounded-md
                      transition
                      ease-in-out
                      m-0
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                    "
                    id="exampleFormControlTextarea1"

                    placeholder="輸入備註"
                  ></textarea>
              </div>
              
              <div className=" bg-indigo-300 relative left-40 top-2 h-60 lg:w-60 rounded-md ">
              <img src={order.img} alt="" className="objet-none rounded-md"/>
              </div>

              <button className="del-button bg-slate-500 hover:bg-slate-400 text-white font-bold h-20 lg:w-24  relative top-28 left-48 rounded-md ">刪除</button>
            </div>
          ))}
          <button className="shop-button bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md ">繼續選購</button>
          <button className="correct-button  bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md ">確認下單</button>
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </>
  );
};

export default CartPage;import React from "react";

// import './OrderRecord.css';

const orders = [
  {
    store: "藏壽司",
    meal: "炙燒壽司",
    cost: 100,
    img: "/menu_1_img.jpg",
  },
  {
    store: "游壽司",
    meal: "蛙式壽司",
    cost: 90,
    img: "/menu_2_img.jpg",
  },
  // {
  //   store: "壽司狼",
  //   meal: "wolf",
  //   cost: 80,
  //   img: '/menufood_1_img.jpg',
  // },
  // Add more orders as needed
];

const CartPage = () => {
  return (
    <>
      

      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content  rounded-md grid gap-4 bg-white p-20">
          {orders.map((order, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } flex rounded-md h-80 pt-5 bg-info px-40 `}
              key={index}
            >
              <div className="relative rounded-md w-100">
                
                <div className="tags">
                  <label className="md:font-bold">店名：</label>
                  <div className="store-tag relative rounded-md p-2 pr-20 bg-white">{order.store}</div>
                </div>

                <label className="md:font-bold">餐點：</label>
                <div className="meal-tag">
                  <div className="meal relative rounded-md p-2 pr-20 bg-white">{order.meal}</div>
                </div>

                <label className="md:font-bold">數量：</label>
                <div className="number relative rounded-md p-2 pr-20 bg-white">
                    <select className="number-dropdown w-20">
                      <option className="number-list" value="1"> 1 </option>
                      <option className="number-list" value="2"> 2 </option>
                      <option className="number-list" value="3"> 3 </option>
                      <option className="number-list" value="4"> 4 </option>
                    </select>
                </div>

                <label className="md:font-bold">金額：</label>
                <div className="cost-tag relative rounded-md p-2 pr-20 bg-white">
                  <div className="cost">${order.cost}</div>
                </div>

                </div>
              
                <label className="relative left-20 md:font-bold">備註：</label>
              <div className="relative left-20 top-10 ">
              <textarea
                    className="
                      form-control
                      block
                      w-full
                      px-10
                      py-20
                      text-base
                      font-normal
                      text-gray-700
                      bg-white bg-clip-padding
                      border border-solid border-gray-300
                      rounded-md
                      transition
                      ease-in-out
                      m-0
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                    "
                    id="exampleFormControlTextarea1"

                    placeholder="輸入備註"
                  ></textarea>
              </div>
              
              <div className=" bg-indigo-300 relative left-40 top-2 h-60 lg:w-60 rounded-md ">
              <img src={order.img} alt="" className="objet-none rounded-md"/>
              </div>

              <button className="del-button bg-slate-500 hover:bg-slate-400 text-white font-bold h-20 lg:w-24  relative top-28 left-48 rounded-md ">刪除</button>
            </div>
          ))}
          <button className="shop-button bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md ">繼續選購</button>
          <button className="correct-button  bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md ">確認下單</button>
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </>
  );
};

export default CartPage;