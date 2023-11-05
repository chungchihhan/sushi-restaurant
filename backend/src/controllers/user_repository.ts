import type {
    CreateUserPayload,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
} from '@lib/shared_types';

import UserModel from '../models/user';

export class UserRepository {
    async findAll(): Promise<GetUsersResponse> {
        return UserModel.find({});
    }

    async findById(id: string): Promise<GetUserResponse | null> {
        return UserModel.findById(id);
    }

    async existsByName(name: string): Promise<{ id: string } | null> {
        const userExists = await UserModel.exists({ name });
        if (userExists) return { id: userExists._id as string };
        return null;
    }

    async create(payload: CreateUserPayload): Promise<{ id: string }> {
        const user = new UserModel(payload);
        return user.save();
    }

    async updateById(id: string, payload: UpdateUserPayload) {
        // mongoose would ignore undefined values
        return UserModel.findByIdAndUpdate(id, payload, { new: true });
    }

    async deleteById(id: string) {
        return UserModel.findByIdAndDelete(id);
    }
}
