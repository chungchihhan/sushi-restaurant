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
  
export function getShop(id: string) {
  return client.get<GetShopResponse>(`shop/${id}`);
}

export function editShop(
  id: string, 
  input: UpdateShopPayload,
  config: AxiosRequestConfig,
  ) {
  return client.put<UpdateShopResponse>(`shop/${id}`, input,config);
}

export async function UploadImageForShop(id: string, input: FormData) {
  // Send FormData in the request
  try {
    const response = await client.post(`shop/${id}/image`, input, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the appropriate content type for file upload
      }
    });
    // Handle response here, e.g., confirm upload success
    console.log('Upload successful');
  } catch (error) {
    // Handle any errors here
    console.error('Upload failed', error);
  }
}

export function GetImageForShop(id:string){
  return client.get<GetShopImageUrlResponse>(`shop/${id}`);
}

export function createMeal(id:string,input:CreateMealPayload){
  return client.post<CreateMealResponse>(`shop/${id}/meal`,input);
}

export function updateMeal(shop_id: string, meal_id:string ,input:UpdateMealPayload){
  return client.post<UpdateMealResponse>(`shop/${shop_id}/meal/${meal_id}`,input);
}
export function deleteMeal(shop_id: string, meal_id:string){
  return client.delete<DeleteMealResponse>(`shop/${shop_id}/meal/${meal_id}`);
}

export function getMealsByShopId(id: string) {
  return client.get<GetMealsResponse>(`shop/${id}/meals`);
}

export async function UploadImageForMeal(shop_id: string, meal_id:string ,input: FormData) {
  // Send FormData in the request
  try {
    console.log(shop_id)
    console.log(meal_id)
    await client.post(`shop/${shop_id}/meal/${meal_id}/image`, input, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the appropriate content type for file upload
      }
    });
    // Handle response here, e.g., confirm upload success
    console.log('Upload successful');
  } catch (error) {
    // Handle any errors here
    console.error('Upload failed', error);
  }
}

export function GetImageForMeal(shop_id: string, meal_id:string){
  return client.get<GetShopImageUrlResponse>(`shop/${shop_id}/meal/${meal_id}/image`);
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
