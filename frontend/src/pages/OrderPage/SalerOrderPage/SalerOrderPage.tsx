import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getOrdersByShopId } from "../../../utils/client";
import type { ShopOrderHistoryData } from "@lib/shared_types";

import SalerOrderItem from "./_components/SalerOrderItem";

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("userToken");
const shopId = localStorage.getItem("shopId");
const isAuthenticated = token && userId;

const SalerOrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ShopOrderHistoryData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (shopId) {
          const res = await getOrdersByShopId(shopId);
          if (res.data.length === 0) {
            toast.info("No orders found for this shop.");
          } else {
            setOrders(res.data);
          }
        } else {
          toast.error("shopId is null");
        }
      } catch (error) {
        toast.error("Error fetching orders");
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <div className="rounded-md px-24 py-8">
        <div className="grid gap-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <SalerOrderItem
                key={order.order_id}
                order={order}
                shopId={shopId ?? ""}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default SalerOrderPage;
