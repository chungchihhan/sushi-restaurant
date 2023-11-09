import type { MenuData } from '@lib/shared_types_shop';
import mongoose from 'mongoose';
import type { Types } from 'mongoose';

interface MenuDocument
    extends Omit<MenuData, 'id' | 'shop_id'>,
        mongoose.Document {
    shop_id: Types.ObjectId;
}

interface MenuModel extends mongoose.Model<MenuDocument> {}

const MenuSchema = new mongoose.Schema<MenuDocument>(
    {
        shop_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
        },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                ret.shop_id = ret.shop_id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    },
);

const Menu = mongoose.model<MenuDocument, MenuModel>('Menu', MenuSchema);

export default Menu;
