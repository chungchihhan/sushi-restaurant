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
    order_items: Omit<OrderItemData, "id" | "order_id">[];
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

//----------

export type ShopData = {
    id: string;
    user_id: string;
    name: string;
    address: string;
    phone: string;
    image: string;
    category: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
};

export type MealData = {
    id: string;
    shop_id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    image: string;
}

export type ReviewData = {
    id: string;
    user_id: string;
    shop_id: string;
    rating: number;
}

export type CreateShopPayload = Omit<ShopData, "id">;

export type CreateShopResponse = Pick<ShopData, "id">;

export type GetShopResponse = Omit<ShopData, "password">;

export type GetShopsResponse = GetShopResponse[];

export type UpdateShopPayload = Partial<Omit<ShopData, "id" | "user_id" >>;

export type UpdateShopResponse = "OK";

export type DeleteShopResponse = "OK";

//---------

export type CreateMealPayload = Omit<MealData, "id">;

export type CreateMealResponse = Pick<MealData, "id">;

export type GetMealResponse = MealData;

export type GetMealsResponse = GetMealResponse[];

export type UpdateMealPayload = Partial<Omit<MealData, "id">>;

export type UpdateMealResponse = "OK";

export type DeleteMealResponse = "OK";

//---------

export type CreateReviewPayload = Omit<ReviewData, "id">;

export type CreateReviewResponse = Pick<ReviewData, "id">;

export type GetReviewResponse = ReviewData;

export type GetReviewsResponse = GetReviewResponse[];

export type UpdateReviewPayload = Partial<Pick<ReviewData, "rating">>;

export type UpdateReviewResponse = "OK";

export type DeleteReviewResponse = "OK";