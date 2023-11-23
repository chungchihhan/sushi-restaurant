export type UserData = {
    id: string;
    name: string;
    password: string;
    email: string;
    phone: string;
    role: string;
    birthday: string;
    verified: boolean;
    created_at: string;
    last_login: string;
};

export type CreateUserPayload = Omit<UserData, "id" | "created_at" | "verified" | "last_login">;

export type CreateUserResponse = Pick<UserData, "id">;

export type GetUserResponse = UserData;

export type GetUsersResponse = GetUserResponse[];

export type UpdateUserPayload = Partial<Pick<UserData, "password" | "email" | "phone" | "birthday">>

export type updateUserResponse = "OK";

export type deleteUserResponse = "OK";

export type userLoginPayload = Pick<UserData, "name" | "password">;

export type userLoginResponse = {id:string, token: string};

export enum OrderStatus {
    CART = "cart",
    WAITING = "waiting",
    INPROGRESS = "inprogress",
    READY = "ready",
    FINISHED = "finished",
    CANCELLED = "cancelled",
}

export type OrderData = {
    id: string;
    user_id: string;
    shop_id: string;
    order_items: OrderItemData[];
    order_date: string;
    status: string;
};

export type CreateOrderPayload = Omit<OrderData, "id" | "order_date" | "status">;

export type CreateOrderResponse = Pick<OrderData, "id">;

export type GetOrderResponse = OrderData;

export type GetOrdersResponse = GetOrderResponse[];

export type GetOrderDetailsPayload = Pick<OrderData, "id" | "user_id">;

export type UpdateOrderPayload = Pick<OrderData, "status">;

export type CancelOrderPayload = Pick<OrderData, "id" | "user_id">;

export type GetOrderDetailsResponse = OrderData;

export type UpdateOrderResponse = "OK";

export type DeleteOrderResponse = "OK";


export type OrderItemData = {
    id: string;
    order_id: string;
    meal_id: string; // search name, price via meal_id
    quantity: number;
};

export type CreateOrderItemPayload = Omit<OrderItemData, "id">;

export type CreateOrderItemResponse = Pick<OrderItemData, "id">;

export type GetOrderItemResponse = OrderItemData;

export type GetOrderItemsResponse = GetOrderItemResponse[];

export type UpdateOrderItemPayload = Partial<Pick<OrderItemData, "quantity">>;

export type UpdateOrderItemResponse = "OK";

export type DeleteOrderItemResponse = "OK";
