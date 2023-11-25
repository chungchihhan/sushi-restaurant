import type { UserData } from '@lib/shared_types';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

interface UserDocument extends Omit<UserData, 'id'>, mongoose.Document {
    id: Types.ObjectId;
}

interface UserModel extends mongoose.Model<UserDocument> {}

const UserSchema = new mongoose.Schema<UserDocument>(
    {
        account: { type: String, required: true },
        password: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        role: { type: String, required: true },
        birthday: { type: String, required: true },
        verified: { type: Boolean, required: true },
        created_at: { type: String, required: true },
        last_login: { type: String, required: true },
    },
    {
        // timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export default User;
