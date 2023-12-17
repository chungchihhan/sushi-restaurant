import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CheckoutDialog from "./CheckoutDialog";

type OrderItem = {
  meal_id: string;
  meal_name: string;
  quantity: number;
  price: number;
  remark: string;
};

type ShopOrder = {
  shop_name: string;
  shop_image: string;
  items: OrderItem[];
};

type OrdersByShop = {
  [shopId: string]: ShopOrder;
};

type UserOrderData = {
  user_id: string;
  orders_by_shop: OrdersByShop;
};

type CartItemProps = {
  // order: UserOrderHistoryData;
  // userId: string;
  user_id: string;
  shop_id: string;
  shop_name: string;
  shop_image: string;
  order_items: OrderItem[];
  updateOrderInLocalStorage: (updatedOrder: UserOrderData) => void;
};

export default function CartItem({
  user_id,
  shop_id,
  shop_name,
  shop_image,
  order_items,
  updateOrderInLocalStorage,
}: CartItemProps) {
  const [editableOrderItems, setEditableOrderItems] = useState(order_items);

  const handleItemChange = (
    index: number,
    field: "quantity" | "remark",
    value: number | string,
  ) => {
    const updatedItems = [...editableOrderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditableOrderItems(updatedItems);
  };

  const saveChanges = () => {
    const existingOrdersString = localStorage.getItem("currentOrder");
    if (!existingOrdersString) return;

    const existingOrders: UserOrderData[] = [JSON.parse(existingOrdersString)];

    const updatedOrders = existingOrders.map((order) => {
      if (order.user_id === user_id) {
        return {
          ...order,
          orders_by_shop: {
            ...order.orders_by_shop,
            [shop_id]: {
              shop_name,
              shop_image,
              items: editableOrderItems,
            },
          },
        };
      }
      return order;
    });

    if (updateOrderInLocalStorage) {
      updateOrderInLocalStorage(updatedOrders[0]);
    }

    localStorage.setItem("currentOrder", JSON.stringify(updatedOrders[0]));
  };

  const [isCheckoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenCheckoutDialog = () => {
    saveChanges();
    setCheckoutDialogOpen(true);
  };

  const handleCloseCheckoutDialog = () => {
    setCheckoutDialogOpen(false);
  };

  const handleRemoveOrder = async () => {
    try {
      const existingOrdersString = localStorage.getItem("currentOrder");
      if (!existingOrdersString) return;

      const existingOrders: UserOrderData[] = [
        JSON.parse(existingOrdersString),
      ];

      const updatedOrders = existingOrders.map((order: UserOrderData) => ({
        user_id: order.user_id,
        orders_by_shop: Object.fromEntries(
          Object.entries(order.orders_by_shop).filter(
            ([shopId]) => shopId !== shop_id,
          ),
        ),
      }));

      localStorage.setItem("currentOrder", JSON.stringify(updatedOrders[0]));

      toast.success("Order created successfully!");

      navigate(0);
    } catch (error) {
      toast.error("Error removing an order.");
    }
  };

  const calculateTotal = () => {
    return editableOrderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div className={`flex-col items-center rounded-2xl bg-blue-300 p-2`}>
      <div className="flex flex-col rounded-md p-4">
        <div className="mx-4 mb-2 flex rounded-lg p-2 text-center text-3xl font-bold">
          店名：{shop_name}
        </div>
        <div className="flex gap-4">
          <div className="m-4 flex w-1/5 items-center justify-end overflow-hidden">
            <img
              className="flex justify-center rounded-3xl"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
              src={shop_image}
              alt={shop_name}
            />
          </div>
          <div className="w-4/5 flex-col">
            <div className="flex gap-4 rounded-md p-2">
              <div className="mb-2 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                菜名
              </div>
              <div className="mb-2 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                單價
              </div>
              <div className="mb-2 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                備註
              </div>
              <div className="mb-2 w-1/4 self-center rounded-lg bg-slate-200 p-2 text-center text-2xl font-bold">
                數量
              </div>
            </div>
            <div className="flex-col p-2">
              {editableOrderItems.map((item, index) => (
                <div key={item.meal_name} className="mb-4 flex gap-4">
                  <div className="w-1/4 self-center rounded-lg bg-white p-2 text-center text-xl font-bold">
                    {item.meal_name}
                  </div>
                  <div className="w-1/4 self-center rounded-lg bg-white p-2 text-center text-xl font-bold">
                    ${item.price}
                  </div>
                  <div className="w-1/4">
                    <input
                      type="text"
                      value={item.remark}
                      onChange={(e) =>
                        handleItemChange(index, "remark", e.target.value)
                      }
                      className="w-full rounded-lg border p-2 text-center text-xl font-bold"
                    />
                  </div>
                  <div className="w-1/4">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                      className="w-full rounded-lg border p-2 text-center text-xl font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2 h-px border-0 dark:bg-slate-700"></hr>
      <div className="mb-4 flex justify-between gap-4 rounded-lg p-2 text-xl font-bold">
        <div className="flex w-3/4 items-center justify-start gap-4 text-center">
          <Link
            className="flex w-1/6 items-center justify-center rounded-3xl bg-slate-300 p-2 text-center font-bold text-white hover:bg-blue-500"
            to={`/shopbuyer/${shop_id}`}
            onClick={saveChanges}
          >
            繼續選購
          </Link>
          <button
            className="flex w-1/6 items-center justify-center rounded-3xl bg-slate-300 p-2 text-center font-bold text-white hover:bg-blue-500"
            onClick={() => {
              saveChanges;
              handleOpenCheckoutDialog();
            }}
          >
            前往結帳
          </button>
          <button
            className="flex w-1/6 items-center justify-center rounded-3xl bg-slate-300 p-2 text-center font-bold text-white hover:bg-blue-500"
            onClick={handleRemoveOrder}
          >
            移除購物車
          </button>
          {isCheckoutDialogOpen && (
            <CheckoutDialog
              user_id={user_id}
              shop_id={shop_id}
              shop_name={shop_name}
              order_items={editableOrderItems}
              onClose={handleCloseCheckoutDialog}
            />
          )}
        </div>
        <div className="mr-2 flex w-1/4 items-center justify-end text-center text-2xl">
          總金額:<span className="ml-4 underline">${calculateTotal()}</span>
        </div>
      </div>
    </div>
  );
}
