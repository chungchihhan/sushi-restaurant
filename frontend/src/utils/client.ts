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
} from "@lib/shared_types";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// import { env } from "./env";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
});

export function getUser(id: string, input: AxiosRequestConfig) {
  return client.get<GetUserResponse>(`user/${id}`, input);
}

export function getShop(id: string) {
  return client.get<GetShopResponse>(`shop/${id}`);
}

export function editUser(
  id: string,
  input: UpdateUserPayload,
  config: AxiosRequestConfig,
) {
  return client.put<updateUserResponse>(`user/${id}`, input, config);
}

export function editShop(id: string, input: UpdateShopPayload) {
  return client.put<UpdateShopResponse>(`shop/${id}`, input);
}

export function createUser(input: CreateUserPayload) {
  return client.post<CreateUserResponse>(`user/register`, input);
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
// export function getShop(id: string) {
//   return client.get<GetShopResponse>(`shop/${id}`);
// }

// export function getShops() {
//   return client.get<GetShopsResponse>(`shop`);
// }
// export function getShop(id:string)
