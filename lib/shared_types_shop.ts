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

export type GetShopResponse = ShopData;

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