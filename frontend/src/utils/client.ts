import type {
  GetUsersResponse,
  UpdateUserPayload,
  updateUserResponse,
  CreateUserPayload,
  CreateOrderResponse
} from "@lib/shared_types";

import axios from "axios";

import { env } from "./env";

const VITE_API_URL = "http://localhost:8000/api"

const client = axios.create({
  // baseURL: env.VITE_API_URL,
  baseURL: VITE_API_URL,
});

export function getUser() {
  return client.get<GetUsersResponse>("user");
}

export function editUser(id: string, input: UpdateUserPayload) {
  return client.put<updateUserResponse>(`user/${id}`, input);
}

export function createUser(input: CreateUserPayload) {
  return client.post<CreateOrderResponse>("user", input);
}