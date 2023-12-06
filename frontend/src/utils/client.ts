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

export function userLogin(input: userLoginPayload) {
  return client.post<userLoginResponse>(`user/login`, input);
}

// Order
export function createOrder(input: CreateOrderPayload) {
  return client.post<CreateOrderResponse>(`order`, input);
}

export function createMeaImage(id: string) {
  return client.get<GetMealsResponse>(`order/user/${id}`);
}
