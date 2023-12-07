import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getOrdersByUserId } from "../../../utils/client";
import type { UserOrderHistoryData } from "@lib/shared_types";

import BuyerOrderItem from "./_components/BuyerOrderItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const isAuthenticated = token && userId;

const BuyerOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserOrderHistoryData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!id) return;
        const res = await getOrdersByUserId(id);
        setOrders(res.data);
        console.log(res.data);
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
            <BuyerOrderItem
              key={order.shop_name}
              order={order}
              userId={userId ?? ""}
            />
          ))}
          {/* <button onClick={onClose}>Close</button> */}
        </div>
      </div>
    </>
  );
};

export default BuyerOrderPage;
