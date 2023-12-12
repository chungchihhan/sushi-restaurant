import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutDialog from "./CheckoutDialog";

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

type CartItemProps = {
  // order: UserOrderHistoryData;
  // userId: string;
  user_id: string;
  shop_id: string;
  shop_name: string;
  shop_image: string;
  order_items: OrderItem[];
};

export default function CartItem({
  user_id,
  shop_id,
  shop_name,
  shop_image,
  order_items,
}: CartItemProps) {
  const [isCheckoutDialogOpen, setCheckoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenCheckoutDialog = () => {
    setCheckoutDialogOpen(true);
  };

  const handleCloseCheckoutDialog = () => {
    setCheckoutDialogOpen(false);
  };

  const handleRemoveOrder = async () => {
    try {
      const existingOrdersString = localStorage.getItem("currentOrder");
      if (!existingOrdersString) return;

      const existingOrders: UserOrderData[] = [
        JSON.parse(existingOrdersString),
      ];

      const updatedOrders = existingOrders.map((order: UserOrderData) => ({
        user_id: order.user_id,
        orders_by_shop: Object.fromEntries(
          Object.entries(order.orders_by_shop).filter(
            ([shopId]) => shopId !== shop_id,
          ),
        ),
      }));

      localStorage.setItem("currentOrder", JSON.stringify(updatedOrders[0]));

      toast.success("Order created successfully!");

      navigate(0);
    } catch (error) {
      toast.error("Error removing an order.");
    }
  };

  return (
    <div className={`flex-col items-center bg-blue-300 `}>
      <div className="flex flex-col justify-between rounded-md p-4">
        <div className="tags flex gap-4 rounded-md">
          <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
            店名：{shop_name}
          </div>
        </div>
        <div className="flex">
          <div className="tags max-w-10 m-4 flex max-h-24 gap-4 overflow-hidden rounded-md">
            <img
              src={shop_image}
              alt={shop_name}
              className="max-w-10 m-4 max-h-24"
            />
          </div>
          <div className="flex-col">
            {order_items.map((item) => (
              <div key={item.meal_name} className="flex">
                <div className="order-details item-center m-2 text-2xl font-bold">
                  <div className="store">{item.meal_name}</div>
                </div>
                <div className="order-details item-center m-2 text-xl font-bold">
                  <div className="store">{item.remark}</div>
                </div>
                <div className="order-details item-center m-2 text-3xl font-bold">
                  <div className="store">{item.quantity}</div>
                </div>
                <div className="order-details item-center m-2 text-3xl font-bold">
                  <div className="amount">${item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Link
        className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold font-bold text-white hover:bg-blue-500"
        to={`/shopbuyer/${shop_id}`}
      >
        繼續選購
      </Link>
      <button
        className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold font-bold text-white hover:bg-blue-500"
        onClick={handleOpenCheckoutDialog}
      >
        前往結帳
      </button>
      <button
        className="view-details-button m-4 rounded-full bg-slate-300 px-4 py-2 font-bold font-bold text-white hover:bg-blue-500"
        onClick={handleRemoveOrder}
      >
        從購物車移除
      </button>
      {isCheckoutDialogOpen && (
        <CheckoutDialog
          user_id={user_id}
          shop_id={shop_id}
          shop_name={shop_name}
          order_items={order_items}
          onClose={handleCloseCheckoutDialog}
        />
      )}
    </div>
  );
}
