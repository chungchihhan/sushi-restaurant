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
      <div className="rounded-md px-24 py-8">
        <div className="grid gap-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <BuyerOrderItem
                key={order.order_id}
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
