import { useState } from "react";
import { updateOrder } from "../../../../utils/client";
import type { ShopOrderHistoryData } from "@lib/shared_types";

type SalerOrderItemProps = {
  order: ShopOrderHistoryData;
  shopId: string;
};

export default function SalerOrderItem({ order, shopId }: SalerOrderItemProps) {
  console.log(order);
  const [updatedStatus, setUpdatedStatus] = useState(order.status);
  const [isStatusChangeButtonVisible, setIsStatusChangeButtonVisible] = useState(true);
  const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(true);

  const handleStatusChange = () => {
    updateOrder(shopId, order.order_id, { status: "inprogress" });
    setUpdatedStatus("inprogress");
    setIsStatusChangeButtonVisible(false);
    setIsCancelButtonVisible(false);
  };

  const handleOrderCancelled = () => {
    updateOrder(shopId, order.order_id, { status: "cancelled" });
    setUpdatedStatus("cancelled");
    setIsStatusChangeButtonVisible(false);
    setIsCancelButtonVisible(false);
  };

  const handleStatusSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    updateOrder(shopId, order.order_id, { status: selectedStatus });
    setUpdatedStatus(selectedStatus);
  };

  let statusElement;
  if (updatedStatus === "waiting") {
    statusElement = (
      <div>
        <button
          className={`m-2 bg-green-500 px-4 py-2 text-white ${isStatusChangeButtonVisible ? "" : "hidden"}`}
          onClick={handleStatusChange}
        >
          V
        </button>
        <button
          className={`m-2 bg-red-500 px-4 py-2 text-white ${isCancelButtonVisible ? "" : "hidden"}`}
          onClick={handleOrderCancelled}
        >
          X
        </button>
      </div>
    );
  } else if (updatedStatus === "inprogress") {
    statusElement = (
      <div>
        <select value={updatedStatus} onChange={handleStatusSelectChange}>
          <option value="inprogress">In Progress</option>
          <option value="finished">Finished</option>
        </select>
      </div>
    );
  }

  return (
    <div className={`flex items-center bg-blue-300 ${updatedStatus === "finished" || updatedStatus === "cancelled" ? "grayscale" : ""}`}>
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
        </div>
        <div className="order-details m-2 text-3xl font-bold">
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
      {statusElement}
    </div>
  );
}
