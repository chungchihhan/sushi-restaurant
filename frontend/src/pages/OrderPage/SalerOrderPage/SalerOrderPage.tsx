import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrdersByShopId } from "../../../utils/client";
import type { ShopOrderHistoryData } from "@lib/shared_types";

import SalerOrderItem from "./_components/SalerOrderItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

// http://localhost:3000/order/saler/6566fab5cdc62179a7d5d323
const SalerOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ShopOrderHistoryData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!id) return;
        const res = await getOrdersByShopId(id);
        setOrders(res.data);
      } catch (error) {
        toast.error("Error fetching orders");
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      navigate("/signin");
    }
  }, [id, navigate]);

  return (
    <>
      <div className="order-record-overlay rounded-md p-8">
        <div className="order-record-content grid gap-4">
          {orders.map((order) => (
            <SalerOrderItem
              key={order.order_id}
              order={order}
              shopId={id ?? ""}
            />
          ))}
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </>
  );
};

export default SalerOrderPage;
