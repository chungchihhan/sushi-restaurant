import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        if (!id) return;
        if (!order_id) return;
        const res = await getOrderDetails({ user_id: id, id: order_id });
        setOrderDetail(res.data);
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

  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content  grid gap-4 rounded-md bg-blue-300 p-20">
          <div className="w-100 relative rounded-md">
            <div className="tags">
              <label className="md:font-bold">店名：</label>
              <div className="store-tag relative rounded-md bg-white p-2 pr-20">
                {orderDetail?.id}
              </div>
            </div>
            <label className="md:font-bold">餐點：</label>
            <div className="meal-tag">
              <div className="meal relative rounded-md bg-white p-2 pr-20">
                {orderDetail?.id}
              </div>
            </div>
            <label className="md:font-bold">數量：</label>
            <div className="number relative rounded-md bg-white p-2 pr-20">
              {orderDetail?.status}
            </div>
            <label className="md:font-bold">金額：</label>
            <div className="cost-tag relative rounded-md bg-white p-2 pr-20">
              <div className="cost">${orderDetail?.id}</div>
            </div>
          </div>
          <label className="md:font-bold">備註：</label>
          <div className="cost-tag relative rounded-md bg-white p-2 pr-20">
            <div className="cost">{orderDetail?.remark}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyerOrderDetail;
