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

export type CreateUserPayload = Omit<UserData, "id" | "created_at" | "verified">;

export type CreateUserResponse = Pick<UserData, "id">;

export type GetUserResponse = Omit<UserData, "password">;

export type GetUsersResponse = GetUserResponse[];

export type UpdateUserPayload = Partial<Pick<UserData, "password" | "email" | "phone" | "birthday">>

export type updateUserResponse = "OK";

export type deleteUserResponse = "OK";


export type OrderData = {
    id: string;
    user_id: string;
    shop_id: string;
    order_date: Date;
    total_price: number;
    status: string;
};

export type CreateOrderPayload = Omit<OrderData, "id" | "order_date" | "status">;  // 要忽略total_price嗎？

export type CreateOrderResponse = Pick<OrderData, "id">;

export type GetOrderResponse = OrderData;

export type GetOrdersResponse = GetOrderResponse[];

export type UpdateOrderPayload = Partial<Pick<OrderData, "total_price" | "status">>

export type UpdateOrderResponse = "OK";

export type DeleteUserResponse = "OK";


export type ItemData = {
    id: string;
    order_id: string;
    menu_id: string; // 透過menu_id去找name, price
    quantity: number;
};

export type CreateItemPayload = ItemData;

export type CreateItemResponse = Pick<ItemData, "id">;

export type GetItemResponse = ItemData;

export type GetItemsResponse = GetItemResponse[];

export type UpdateItemPayload = Partial<Pick<ItemData, "quantity">>

export type UpdateItemResponse = "OK";

export type DeleteItemResponse = "OK";