import { useState } from "react";

import { updateOrder } from "../../../../utils/client";
import type { ShopOrderHistoryData } from "@lib/shared_types";

type SalerOrderItemProps = {
  order: ShopOrderHistoryData;
  shopId: string;
};

export default function SalerOrderItem({ order, shopId }: SalerOrderItemProps) {
  const [updatedStatus, setUpdatedStatus] = useState(order.status);
  if (updatedStatus === "waiting") {
    setUpdatedStatus("尚未確認");
  } else if (updatedStatus === "inprogress") {
    setUpdatedStatus("製作中");
  } else if (updatedStatus === "finished") {
    setUpdatedStatus("已完成");
  } else if (updatedStatus === "cancelled") {
    setUpdatedStatus("已取消");
  }

  const [isStatusChangeButtonVisible, setIsStatusChangeButtonVisible] =
    useState(true);
  const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(true);

  const handleStatusChange = () => {
    const isConfirmed = window.confirm("要確認此訂單嗎？");
    if (isConfirmed) {
      updateOrder(shopId, order.order_id, { status: "inprogress" });
      setUpdatedStatus("製作中");
      setIsStatusChangeButtonVisible(false);
      setIsCancelButtonVisible(false);
    }
  };

  const handleOrderCancelled = () => {
    const isConfirmed = window.confirm("要取消此訂單嗎？");
    if (isConfirmed) {
      updateOrder(shopId, order.order_id, { status: "cancelled" });
      setUpdatedStatus("已取消");
      setIsStatusChangeButtonVisible(false);
      setIsCancelButtonVisible(false);
    }
  };

  const handleStatusSelectChange = () => {
    const isConfirmed = window.confirm("要完成此訂單嗎？");
    if (isConfirmed) {
      updateOrder(shopId, order.order_id, { status: "finished" });
      setUpdatedStatus("已完成");
    }
  };

  function addHoursAndFormat(originalTime: string): string {
    const originalDate = new Date(originalTime);
    const newDate = new Date(originalDate.getTime());

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  let statusElement;
  if (updatedStatus === "尚未確認") {
    statusElement = (
      <div className="flex items-center justify-center gap-4 rounded-3xl">
        <button
          className={`w-1/2 rounded-3xl bg-blue-400 p-2 text-white ${
            isStatusChangeButtonVisible ? "" : "hidden"
          }`}
          onClick={handleStatusChange}
        >
          確認
        </button>
        <button
          className={`w-1/2 rounded-3xl bg-slate-400 p-2 text-white ${
            isCancelButtonVisible ? "" : "hidden"
          }`}
          onClick={handleOrderCancelled}
        >
          取消
        </button>
      </div>
    );
  } else if (updatedStatus === "製作中") {
    statusElement = (
      <div className="flex w-full items-center justify-center">
        <button
          onClick={handleStatusSelectChange}
          className="w-1/2 rounded-3xl bg-blue-400 p-2"
        >
          完成
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex-col items-center rounded-2xl ${
        updatedStatus === "已完成" || updatedStatus === "已取消"
          ? "bg-slate-400 grayscale"
          : "bg-slate-900"
      }`}
    >
      <div className="flex w-full items-center justify-between gap-4 rounded-md p-4">
        <div className="w-2/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          單號: #{order.order_id}
        </div>
        <div className="w-1/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          {addHoursAndFormat(order.order_date)}
        </div>
        <div className="w-1/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          {updatedStatus}
        </div>
        <div className="w-1/5 rounded-lg p-2 text-center text-2xl font-bold">
          {statusElement}
        </div>
      </div>
      <div className="m-4 flex-col gap-4 rounded-md bg-info p-2">
        <div className="flex gap-4 rounded-md bg-info py-2">
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            品項
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            數量
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            金額
          </div>
          <div className="w-1/4 self-center rounded-lg bg-slate-400 p-2 text-center text-3xl font-bold">
            備註
          </div>
        </div>
        <div className="grid gap-4">
          {order.order_items.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-md bg-info">
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.meal_name}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.quantity}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.sum_price}
              </div>
              <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                {item.remark}
              </div>
            </div>
          ))}
        </div>
        <hr className="my-2 h-px border-0 dark:bg-slate-700"></hr>
        <div className="flex justify-end rounded-lg p-4 text-3xl font-bold">
          總金額:<span className="ml-4 underline">{order.total_price}</span>
        </div>
      </div>
    </div>
  );
}
