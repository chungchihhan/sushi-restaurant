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
    wensday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
};

export type MenuData = {
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

export type updateShopResponse = "OK";

export type deleteShopResponse = "OK";

//---------

export type CreateMenuPayload = Omit<MenuData, "id">;

export type CreateMenuResponse = Pick<MenuData, "id">;

export type GetMenuResponse = MenuData;

export type GetMenusResponse = GetMenuResponse[];

export type UpdateMenuPayload = Partial<Omit<MenuData, "id">>;

export type updateMenuResponse = "OK";

export type deleteMenuResponse = "OK";

//---------

export type CreateReviewPayload = Omit<ReviewData, "id" | "user_id">;

export type CreateReviewResponse = Pick<ReviewData, "id">;

export type GetReviewResponse = ReviewData;

export type GetReviewsResponse = GetReviewsResponse[];

export type deleteReviewResponse = "OK";