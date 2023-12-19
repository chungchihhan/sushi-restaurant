import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrderDetails } from "../../../../utils/client";
import type { OrderDetailsData } from "@lib/shared_types";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

const BuyerOrderDetail = () => {
  const { id, order_id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<OrderDetailsData>();
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        if (!id) return;
        if (!order_id) return;
        const res = await getOrderDetails({ user_id: id, id: order_id });
        setOrderDetail(res.data);

        const status = res.data.status;
        if (status === "waiting") {
          setOrderStatus("未確認");
        } else if (status === "inprogress") {
          setOrderStatus("製作中");
        } else if (status === "finished") {
          setOrderStatus("已完成");
        } else if (status === "cancelled") {
          setOrderStatus("已取消");
        }
      } catch (error) {
        toast.error("Error fetching order detail");
      }
    };

    if (isAuthenticated) {
      fetchOrderDetail();
    } else {
      navigate("/signin");
    }
  }, [id, order_id, navigate]);

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

  return (
    <div className="mx-24 my-12 flex-col gap-4 rounded-md bg-info px-12 py-6">
      <label className="mb-2 flex justify-center self-center p-3 text-center text-4xl font-bold">
        訂單細節
      </label>
      <div className="flex w-full items-center justify-between gap-4 rounded-md p-2">
        <div className="w-2/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          商店名: {orderDetail?.shop_name}
        </div>
        <div className="w-1/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          {addHoursAndFormat(orderDetail?.date ?? "")}
        </div>
        <div className="w-1/5 rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
          {orderStatus}
        </div>
      </div>
      <div className="flex gap-4 rounded-md bg-info p-2">
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
      <div className="grid gap-4 p-2">
        {orderDetail?.order_items.map((item, index) => (
          <div key={index} className="flex gap-4 rounded-md bg-info">
            <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              {item.meal_name}
            </div>
            <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              {item.quantity}
            </div>
            <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              {item.meal_price}
            </div>
            <div className="w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
              {item.remark}
            </div>
          </div>
        ))}
      </div>
      <hr className="my-2 h-px border-0 dark:bg-slate-700"></hr>
      <div className="flex justify-between gap-4 rounded-lg p-2 text-2xl font-bold">
        <Link
          className="flex w-1/4 items-center justify-center rounded-3xl bg-blue-500 p-2 text-center font-bold text-white hover:bg-blue-700"
          to={`/shopbuyer/${orderDetail?.shop_id}`}
        >
          再次購買
        </Link>
        <div className="flex w-2/4 items-center justify-end text-center">
          總金額:
          <span className="ml-4 underline">{orderDetail?.total_price}</span>
        </div>
      </div>
    </div>
  );
};

export default BuyerOrderDetail;
