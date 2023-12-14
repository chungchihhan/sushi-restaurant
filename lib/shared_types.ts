export type UserData = {
    id: string;
    account: string; // serial number
    password: string;
    username: string;
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

export type userLoginPayload = Pick<UserData, "account" | "password">;

export type userLoginResponse = {id:string, token: string, shop_id: string};

//----------

export enum OrderStatus {
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

export type OrderDetailsData = {
    id: string;
    user_id: string;
    status: string;
    date: string;
    order_items: {
        meal_name: string;
        quantity: number;
        meal_price: number;
        remark: string;
    }[];
    shop_name: string;
    shop_id: string;
    total_price: number;
}


export type CreateOrderPayload = Omit<OrderData, "id" | "order_date" | "status">;

export type CreateOrderResponse = Pick<OrderData, "id">;

export type GetOrderResponse = OrderData;

export type GetOrdersResponse = GetOrderResponse[];

export type GetOrderDetailsPayload = Pick<OrderData, "id" | "user_id">;

export type GetOrderDetailsResponse = OrderDetailsData;

export type UpdateOrderPayload = Pick<OrderData, "status">;

export type CancelOrderPayload = Pick<OrderData, "id" | "user_id">;


export type UpdateOrderResponse = "OK";

export type DeleteOrderResponse = "OK";

//--------

export type UserOrderHistoryData = {
    order_id: string;
    status: string;
    order_date: string;
    order_price: number;
    shop_name: string;
    shop_image: string;
}

export type GetOrdersByUserIdResponse = UserOrderHistoryData[];

export type ShopOrderHistoryData = {
    order_id: string;
    status: string;
    order_date: string;
    order_items: {
        meal_name: string;
        quantity: number;
        sum_price: number;
        remark: string;
    }[];
    total_price: number;
}

export type GetOrdersByShopIdResponse = ShopOrderHistoryData[];

//--------

export type OrderItemData = {
    id: string;
    order_id: string;
    meal_id: string; // search name, price via meal_id
    quantity: number;
    remark: string;
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
    active: boolean;
}

export type ReviewData = {
    id: string;
    user_id: string;
    shop_id: string;
    rating: number;
}

export enum CategoryList {
    Chinese = "中式",
    American = "美式",
    Japanese = "日式",
    Korean = "韓式",
    HongKong = "港式",
    Beverage = "飲料",
}

export type MealRevenueDetail = {
    meal_name: string,
    meal_price: number,
    quantity: number,
    revenue: number,
}

export type CreateShopPayload = Omit<ShopData, "id">;

export type CreateShopResponse = Pick<ShopData, "id">;

export type GetShopResponse = ShopData;

export type GetShopsResponse = GetShopResponse[];

export type GetShopsCategoryResponse = {category: CategoryList, totalSum: number }[];

export type UpdateShopPayload = Partial<Omit<ShopData, "id" | "user_id" >>;

export type UpdateShopResponse = "OK";

export type DeleteShopResponse = "OK";

export type GetShopImageUrlResponse = Pick<ShopData, "image">;

//---------

export type CreateMealPayload = Omit<MealData, "id"| "status">;

export type CreateMealResponse = Pick<MealData, "id">;

export type GetMealResponse = MealData;

export type GetMealsResponse = GetMealResponse[];

export type UpdateMealPayload = Partial<Omit<MealData, "id">>;

export type UpdateMealResponse = Pick<MealData, "id">;

export type DeleteMealResponse = "OK";

export type GetMealImageUrlResponse = Pick<MealData, "image">;

//---------

export type CreateReviewPayload = Omit<ReviewData, "id">;

export type CreateReviewResponse = Pick<ReviewData, "id">;

export type GetReviewResponse = ReviewData;

export type GetReviewsResponse = GetReviewResponse[];

export type UpdateReviewPayload = Partial<Pick<ReviewData, "rating">>;

export type UpdateReviewResponse = "OK";

export type DeleteReviewResponse = "OK";
