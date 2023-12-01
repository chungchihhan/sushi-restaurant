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
];

const CartPage = () => {
  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content  grid gap-4 rounded-md bg-white p-20">
          {orders.map((order, index) => (
            <div
              className={`order ${
                index % 2 === 0 ? "gray-background" : ""
              } flex h-80 rounded-md bg-info px-40 pt-5 `}
              key={index}
            >
              <div className="w-100 relative rounded-md">
                <div className="tags">
                  <label className="md:font-bold">店名：</label>
                  <div className="store-tag relative rounded-md bg-white p-2 pr-20">
                    {order.store}
                  </div>
                </div>

                <label className="md:font-bold">餐點：</label>
                <div className="meal-tag">
                  <div className="meal relative rounded-md bg-white p-2 pr-20">
                    {order.meal}
                  </div>
                </div>

                <label className="md:font-bold">數量：</label>
                <div className="number relative rounded-md bg-white p-2 pr-20">
                  <select className="number-dropdown w-20">
                    <option className="number-list" value="1">
                      {" "}
                      1{" "}
                    </option>
                    <option className="number-list" value="2">
                      {" "}
                      2{" "}
                    </option>
                    <option className="number-list" value="3">
                      {" "}
                      3{" "}
                    </option>
                    <option className="number-list" value="4">
                      {" "}
                      4{" "}
                    </option>
                  </select>
                </div>

                <label className="md:font-bold">金額：</label>
                <div className="cost-tag relative rounded-md bg-white p-2 pr-20">
                  <div className="cost">${order.cost}</div>
                </div>
              </div>

              <label className="relative left-20 md:font-bold">備註：</label>
              <div className="relative left-20 top-10 ">
                <textarea
                  className="
                      form-control
                      m-0
                      block
                      w-full
                      rounded-md
                      border
                      border-solid
                      border-gray-300
                      bg-white bg-clip-padding
                      px-10 py-20 text-base
                      font-normal
                      text-gray-700
                      transition
                      ease-in-out
                      focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none
                    "
                  id="exampleFormControlTextarea1"
                  placeholder="輸入備註"
                ></textarea>
              </div>

              <div className=" relative left-40 top-2 h-60 rounded-md bg-indigo-300 lg:w-60 ">
                <img src={order.img} alt="" className="objet-none rounded-md" />
              </div>

              <button className="del-button relative left-48 top-28 h-20 rounded-md bg-slate-500  font-bold text-white hover:bg-slate-400 lg:w-24 ">
                刪除
              </button>
            </div>
          ))}
          <button className="shop-button rounded-md bg-slate-300 font-bold text-white hover:bg-blue-500 lg:w-72 ">
            繼續選購
          </button>
          {/* <button className="correct-button  bg-slate-300 hover:bg-blue-500 text-white font-bold lg:w-72 rounded-md " onClick={handleSubmit}>確認下單</button> */}
        </div>
      </div>
    </>
  );
};

export default CartPage;
