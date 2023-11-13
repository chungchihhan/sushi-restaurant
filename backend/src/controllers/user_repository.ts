import type {
    CreateUserPayload,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
    UserData,
} from '@lib/shared_types';

import UserModel from '../models/user';

interface IUserRepository {
    findAll(): Promise<GetUsersResponse>;
    findById(id: string): Promise<GetUserResponse | null>;
    existsByName(name: string): Promise<boolean>;
    create(payload: CreateUserPayload): Promise<Pick<UserData, 'id'>>;
    updateById(id: string, payload: UpdateUserPayload): Promise<boolean>;
    deleteById(id: string): Promise<boolean>;
}

export class MongoUserRepository implements IUserRepository {
    async findAll(): Promise<GetUsersResponse> {
        return UserModel.find({});
    }

    async findById(id: string): Promise<GetUserResponse | null> {
        return UserModel.findById(id);
    }

    async existsByName(name: string): Promise<boolean> {
        const userExists = await UserModel.exists({ name });
        if (userExists) return true;
        return false;
    }

    async create(payload: CreateUserPayload): Promise<Pick<UserData, 'id'>> {
        const user = new UserModel(payload);
        return user.save();
    }

    async updateById(id: string, payload: UpdateUserPayload): Promise<boolean> {
        // mongoose would ignore undefined values
        const result = await UserModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        return result != null;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result != null;
    }
}
