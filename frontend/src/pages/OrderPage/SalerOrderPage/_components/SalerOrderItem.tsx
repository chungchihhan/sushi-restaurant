import { useState } from "react";

import { updateOrder } from "../../../../utils/client";
import type { ShopOrderHistoryData } from "@lib/shared_types";

type SalerOrderItemProps = {
  order: ShopOrderHistoryData;
  shopId: string;
};

export default function SalerOrderItem({ order, shopId }: SalerOrderItemProps) {
  const [updatedStatus, setUpdatedStatus] = useState(order.status);

  const handleStatusChange = () => {
    updateOrder(shopId, order.order_id, { status: "inprogress" });
    setUpdatedStatus("");
  };

  const handleOrderDelete = () => {
    alert("哈囉！今天過得好嗎！");
  };

  return (
    <div className="flex items-center  bg-blue-300">
      <div className="flex flex-col items-center rounded-md p-4">
        <div className="tags flex gap-4 rounded-md">
          <div className="date-tag bg-green-300 p-2 text-2xl font-bold">
            {order.order_id}
          </div>
          <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
            {updatedStatus}
          </div>
          <div className="date-tag bg-green-300 p-2 text-2xl font-bold">
            {order.order_date}
          </div>
        </div>
        <div className="order-details m-2 text-2xl font-bold">
          {/* <div className="store">{order.shop_name}</div> */}
        </div>
        <div className="order-details m-2 text-3xl font-bold">
          {/* <div className="amount">${order.order_price}</div> */}
        </div>
      </div>
      <div className="order-record-content grid gap-4">
        {order.order_items.map((item, index) => (
          <div key={index} className="order-details m-2 text-3xl font-bold">
            <div className="amount">${item.meal_name}</div>
            <div className="amount">${item.quantity}</div>
            <div className="amount">${item.sum_price}</div>
          </div>
        ))}
      </div>
      <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
        {order.remark}
      </div>
      <div className="status-tag bg-blue-400 p-2 text-2xl font-bold">
        {order.total_price}
      </div>
      <button
        className="m-2 bg-green-500 px-4 py-2 text-white"
        onClick={handleStatusChange}
      >
        V
      </button>
      <button
        className="m-2 bg-red-500 px-4 py-2 text-white"
        onClick={handleOrderDelete}
      >
        X
      </button>
    </div>
  );
}
