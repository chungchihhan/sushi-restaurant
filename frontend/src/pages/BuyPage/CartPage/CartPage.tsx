import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import CartItem from "./_components/CartItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

type OrderItem = {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  remark: string;
};

type ShopOrder = {
  shop_name: string;
  shop_image: string;
  items: OrderItem[];
};

type OrdersByShop = {
  [shopId: string]: ShopOrder;
};

type UserOrderData = {
  user_id: string;
  orders_by_shop: OrdersByShop;
};

const CartPage = () => {
  const orderDataString = localStorage.getItem("currentOrder");
  const orderData: UserOrderData[] =
    orderDataString !== null && orderDataString !== "[]"
      ? [JSON.parse(orderDataString)]
      : [];

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  });

  const updateOrderInLocalStorage = (updatedOrder: UserOrderData) => {
    localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
    // Other necessary logic, if any
  };

  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content grid gap-4">
          {orderData.length > 0 ? (
            orderData.map((orderDataItem: UserOrderData) => {
              const ordersByShop = orderDataItem.orders_by_shop;

              return Object.keys(ordersByShop).length > 0 ? (
                Object.entries(ordersByShop).map(([shopId, order]) => (
                  <CartItem
                    key={shopId}
                    user_id={orderDataItem.user_id}
                    shop_id={shopId}
                    shop_name={order.shop_name}
                    shop_image={order.shop_image}
                    order_items={order.items}
                    updateOrderInLocalStorage={updateOrderInLocalStorage}
                  />
                ))
              ) : (
                <div
                  key={orderDataItem.user_id}
                  className="order-record-overlay rounded-md p-8"
                >
                  <p className="mb-4">No orders available.</p>
                  <Link
                    className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold text-white hover:bg-blue-500"
                    to={`/meal/`}
                  >
                    繼續選購
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="order-record-overlay rounded-md p-8">
              <p className="mb-4">No orders available.</p>
              <Link
                className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold text-white hover:bg-blue-500"
                to={`/meal/`}
              >
                繼續選購
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
