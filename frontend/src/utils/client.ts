import type {
  // User
  GetUsersResponse,
  UpdateUserPayload,
  updateUserResponse,
  CreateUserPayload,
  CreateUserResponse,
  userLoginPayload,
  userLoginResponse,
  // Order
  CreateOrderPayload,
  CreateOrderResponse,
  GetOrderResponse,
  GetOrderDetailsPayload,
  // Shop
  GetShopResponse,
  GetShopsResponse,
} from "@lib/shared_types";

import axios from "axios";

// import { env } from "./env";

const VITE_API_URL = "http://localhost:8000/api";

const client = axios.create({
  // baseURL: env.VITE_API_URL,
  baseURL: VITE_API_URL,
});

// User
export function getUser() {
  return client.get<GetUsersResponse>("user");
}

export function editUser(id: string, input: UpdateUserPayload) {
  return client.put<updateUserResponse>(`user/${id}`, input);
}

export function createUser(input: CreateUserPayload) {
  return client.post<CreateUserResponse>(`user/register`, input);
}

export function userLogin(input: userLoginPayload) {
  return client.post<userLoginResponse>(`user/login`, input);
}

// Order
export function createOrder(input: CreateOrderPayload) {
  return client.post<CreateOrderResponse>(`order`, input);
}

// Shop
export function getShop(id: string) {
  return client.get<GetShopResponse>(`shop/${id}`);
}

export function getShops() {
  return client.get<GetShopsResponse>(`shop`);
}