import type {
  GetUserResponse,
  UpdateUserPayload,
  updateUserResponse,
  CreateUserPayload,
  CreateUserResponse,
  userLoginPayload,
  userLoginResponse,
  CreateShopPayload,
  CreateShopResponse,
  UpdateShopPayload,
  UpdateShopResponse,
  GetShopResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrdersByUserIdResponse,
  GetOrdersByShopIdResponse,
  UpdateOrderResponse,
  UpdateOrderPayload,
  CancelOrderPayload,
  GetOrderDetailsResponse,
  GetOrderDetailsPayload,
  GetShopsCategoryResponse,
  GetShopsResponse,
  GetShopImageUrlResponse,
  CreateMealPayload,
  CreateMealResponse,
  GetMealsResponse,
  UpdateMealPayload,
  UpdateMealResponse,
  DeleteMealResponse,
} from "@lib/shared_types";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// import { env } from "./env";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

export function createUser(input: CreateUserPayload) {
  return client.post<CreateUserResponse>(`user/register`, input);
}

export function getUser(id: string, input: AxiosRequestConfig) {
  return client.get<GetUserResponse>(`user/${id}`, input);
}
export function editUser(
  id: string,
  input: UpdateUserPayload,
  config: AxiosRequestConfig,
) {
  return client.put<updateUserResponse>(`user/${id}`, input, config);
}
export function createShop(input: CreateShopPayload) {
  return client.post<CreateShopResponse>(`shop`, input);
}

export function getShop(id: string) {
  return client.get<GetShopResponse>(`shop/${id}`);
}

export function editShop(
  id: string,
  input: UpdateShopPayload,
  config: AxiosRequestConfig,
) {
  return client.put<UpdateShopResponse>(`shop/${id}`, input, config);
}

export async function UploadImageForShop(id: string, input: FormData) {
  // Send FormData in the request
  try {
    await client.post(`shop/${id}/image`, input, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the appropriate content type for file upload
      },
    });
    // Handle response here, e.g., confirm upload success
  } catch (error) {
    // Handle any errors here
    console.error("Upload failed", error);
  }
}

export function GetImageForShop(id: string) {
  return client.get<GetShopImageUrlResponse>(`shop/${id}`);
}

export function createMeal(id: string, input: CreateMealPayload) {
  return client.post<CreateMealResponse>(`shop/${id}/meal`, input);
}

export function updateMeal(
  shop_id: string,
  meal_id: string,
  input: UpdateMealPayload,
) {
  return client.put<UpdateMealResponse>(
    `shop/${shop_id}/meal/${meal_id}`,
    input,
  );
}

export function deleteMeal(shop_id: string, meal_id: string) {
  return client.delete<DeleteMealResponse>(`shop/${shop_id}/meal/${meal_id}`);
}

export function getMeals() {
  return client.get<GetMealsResponse>(`meal`);
}

export function getMealsByShopId(id: string) {
  return client.get<GetMealsResponse>(`shop/${id}/meals`);
}

export async function UploadImageForMeal(
  shop_id: string,
  meal_id: string,
  input: FormData,
) {
  // Send FormData in the request
  try {
    await client.post(`shop/${shop_id}/meal/${meal_id}/image`, input, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the appropriate content type for file upload
      },
    });
    // Handle response here, e.g., confirm upload success
  } catch (error) {
    // Handle any errors here
  }
}

export function GetImageForMeal(shop_id: string, meal_id: string) {
  return client.get<GetShopImageUrlResponse>(
    `shop/${shop_id}/meal/${meal_id}/image`,
  );
}

export function createOrder(input: CreateOrderPayload) {
  return client.post<CreateOrderResponse>(`order`, input);
}

export function userLogin(input: userLoginPayload) {
  return client.post<userLoginResponse>(`user/login`, input);
}

export function getOrdersByUserId(id: string) {
  return client.get<GetOrdersByUserIdResponse>(`user/${id}/orders`);
}

export function getOrdersByShopId(id: string) {
  return client.get<GetOrdersByShopIdResponse>(`shop/${id}/orders`);
}

export function cancelOrder(input: CancelOrderPayload) {
  return client.put<UpdateOrderResponse>(
    `user/${input.user_id}/order/${input.id}/cancel`,
    input,
  );
}

export function updateOrder(
  shop_id: string,
  order_id: string,
  input: UpdateOrderPayload,
) {
  return client.put<UpdateOrderResponse>(
    `shop/${shop_id}/order/${order_id}`,
    input,
  );
}

export function getOrderDetails(input: GetOrderDetailsPayload) {
  return client.get<GetOrderDetailsResponse>(
    `user/${input.user_id}/order/${input.id}`,
  );
}

// Shop
export function getShopsCategory() {
  return client.get<GetShopsCategoryResponse>("shop");
}

export function getShopsByCategory(category: string) {
  return client.get<GetShopsResponse>(`shop/category/${category}`);
}

// Revenue
interface GetRevenueResponse {
  balance: number;
}

interface MealDetail {
  meal_name: string;
  meal_price: number;
  quantity: number;
  revenue: number;
}

interface GetRevenueDetailsResponse {
  mealDetails: MealDetail[];
}

export function getRevenue(shop_id: string, y: number, m: number) {
  return client.get<GetRevenueResponse>(
    `shop/${shop_id}/revenue?year=${y}&month=${m}`,
  );
}

export function getRevenueDetails(shop_id: string, y: number, m: number) {
  return client.get<GetRevenueDetailsResponse>(
    `shop/${shop_id}/revenue/details?year=${y}&month=${m}`,
  );
}

interface GetBalanceResponse {
  balance: number;
}
export function getBalance(user_id: string, y: number, m: number) {
  return client.get<GetBalanceResponse>(
    `user/${user_id}/balance?year=${y}&month=${m}`,
  );
}
