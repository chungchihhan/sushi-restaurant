import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutDialog from "./CheckoutDialog";
import { Button } from "@mui/material";

type OrderItem = {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  remark: string;
};

type Order = {
  user_id: string;
  shop_id: string;
  order_items: OrderItem[];
  shop_name: string;
  shop_image: string;
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

      const existingOrders: Order[] = [JSON.parse(existingOrdersString)] ;
      const updatedOrders = existingOrders.filter((order: Order) => order.shop_id !== shop_id);

      localStorage.setItem("currentOrder", JSON.stringify(updatedOrders));

      toast.success("Order created successfully!");

      navigate(0);
    } catch (error) {
      toast.error("Error removing an order.");
    }

  };

  return (
    <div className={`flex items-center bg-blue-300 `}>
      <div className="flex flex-col items-center rounded-md p-4">
        <div className="tags flex gap-4 rounded-md">
          <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
            店名：{shop_name}
          </div>
        </div>
        <div className="tags flex gap-4 rounded-md">{shop_image}</div>
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
