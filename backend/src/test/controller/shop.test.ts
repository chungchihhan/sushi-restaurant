import type {
    CreateShopPayload,
    CreateShopResponse,
    DeleteShopResponse,
    GetShopResponse,
    GetShopsCategoryResponse,
    GetShopsResponse,
    UpdateOrderPayload,
    UpdateOrderResponse,
    UpdateShopPayload,
    UpdateShopResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { CategoryList, OrderStatus } from '../../../../lib/shared_types';
import { MongoMealRepository } from '../../controllers/meal_repository';
import { MongoOrderItemRepository } from '../../controllers/orderItem_repository';
import { MongoOrderRepository } from '../../controllers/order_repository';
import {
    createShop,
    deleteShop,
    getRevenue,
    getShop,
    getShopByUserId,
    getShops,
    getShopsByCategory,
    getShopsCategory,
    updateOrder,
    updateShop,
} from '../../controllers/shop';
import { MongoShopRepository } from '../../controllers/shop_repository';
import { MongoUserRepository } from '../../controllers/user_repository';
import ShopModel from '../../models/shop';

describe('Shop Controller', () => {
    describe('getShops', () => {
        let res: Response<GetShopsResponse>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse>;
            statusStub.returns(res);

            shopRepoFindAllStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return all shops successfully', async () => {
            const mockShops = [
                { id: '1', name: 'Shop 1' },
                { id: '2', name: 'Shop 2' },
            ];

            shopRepoFindAllStub.resolves(mockShops);

            await getShops({} as Request, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShops)).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllStub.throws(new Error('Database error'));

            await getShops({} as Request, res);
        });
    });

    describe('getShop', () => {
        let req: Request<{ id: string }>,
            res: Response<GetShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return the shop if it exists', async () => {
            const shopId = 'shop1';
            const mockShop = { id: shopId, name: 'Test Shop' };

            shopRepoFindByIdStub.withArgs(shopId).resolves(mockShop);

            req = { params: { id: shopId } } as Request<{ id: string }>;
            await getShop(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShop)).to.be.true;
        });

        it('should return an error if the shop does not exist', async () => {
            shopRepoFindByIdStub.withArgs(sinon.match.any).resolves(null);

            req = { params: { id: 'nonexistentShop' } } as Request<{
                id: string;
            }>;
            await getShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindByIdStub
                .withArgs(sinon.match.any)
                .throws(new Error('Database error'));

            req = { params: { id: 'shop1' } } as Request<{ id: string }>;
            await getShop(req, res);
        });
    });

    describe('getShopsCategory', () => {
        let res: Response<GetShopsCategoryResponse>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsCategoryResponse>;
            statusStub.returns(res);

            shopRepoFindAllStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return category counts for all shops', async () => {
            const mockShops = [
                { id: '1', category: CategoryList.Chinese },
                { id: '2', category: CategoryList.American },
            ];

            shopRepoFindAllStub.resolves(mockShops);

            await getShopsCategory({} as Request, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(
                jsonSpy.calledWith([
                    { category: CategoryList.Chinese, totalSum: 1 },
                    { category: CategoryList.American, totalSum: 1 },
                ]),
            ).to.be.true;
        });

        it('should throw an error if there are shops with invalid categories', async () => {
            const mockShops = [{ id: '1', category: 'InvalidCategory' }];

            shopRepoFindAllStub.resolves(mockShops);

            await getShopsCategory({} as Request, res);
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllStub.throws(new Error('Database error'));

            await getShopsCategory({} as Request, res);
        });
    });

    describe('getShopsByCategory', () => {
        let req: Request<{ category: string }>,
            res: Response<GetShopsResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllByCategoryStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindAllByCategoryStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAllByCategory',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return shops for a valid category', async () => {
            const mockShops = [
                { id: '1', name: 'Shop 1', category: '中式' },
                { id: '2', name: 'Shop 2', category: '中式' },
            ];
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(mockShops);

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShops)).to.be.true;
        });

        it('should return an error if no shops are found for a category', async () => {
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(null);

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllByCategoryStub
                .withArgs('中式')
                .throws(new Error('Database error'));

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);
        });
    });

    describe('getShopByUserId', () => {
        let req: Request<{ user_id: string }>,
            res: Response<GetShopsResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            userRepoFindByIdStub: sinon.SinonStub,
            shopRepoFindByUserIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            shopRepoFindByUserIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findByUserId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the user does not exist', async () => {
            userRepoFindByIdStub.withArgs('nonexistentUser').resolves(null);

            req = { params: { user_id: 'nonexistentUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return an error if the shop does not exist', async () => {
            userRepoFindByIdStub
                .withArgs('existingUser')
                .resolves({ id: 'existingUser' });
            shopRepoFindByUserIdStub.withArgs('existingUser').resolves(null);

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should return the shop if the user and shop exist', async () => {
            const mockShop = { id: 'shop1' };
            userRepoFindByIdStub
                .withArgs('existingUser')
                .resolves({ id: 'existingUser' });
            shopRepoFindByUserIdStub
                .withArgs('existingUser')
                .resolves(mockShop);

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShop)).to.be.true;
        });

        it('should handle exceptions', async () => {
            userRepoFindByIdStub
                .withArgs('existingUser')
                .throws(new Error('Database error'));

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);
        });
    });

    describe('createShop', () => {
        let req: Request<never, never, CreateShopPayload>,
            res: Response<CreateShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoExistsByNameStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<CreateShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoExistsByNameStub = sinon.stub(
                MongoShopRepository.prototype,
                'existsByName',
            );
            sinon
                .stub(ShopModel.prototype, 'save')
                .resolves({ id: 'newShopId' });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the shop already exists', async () => {
            shopRepoExistsByNameStub.resolves(true);

            req = { body: { name: 'Existing Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop already exists' })).to.be
                .true;
        });

        it('should successfully create a shop and return its id', async () => {
            shopRepoExistsByNameStub.resolves(false);

            req = { body: { name: 'New Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonSpy.calledWith({ id: 'newShopId' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoExistsByNameStub.throws(new Error('Database error'));

            req = { body: { name: 'Test Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);
        });
    });

    describe('updateShop', () => {
        let req: Request<{ id: string }, never, UpdateShopPayload>,
            res: Response<UpdateShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindByIdStub: sinon.SinonStub,
            shopRepoUpdateByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<UpdateShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
            shopRepoUpdateByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'updateById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the shop is not found', async () => {
            shopRepoFindByIdStub.resolves(null);

            req = { params: { id: 'nonexistentShopId' }, body: {} } as Request<
                { id: string },
                never,
                UpdateShopPayload
            >;
            await updateShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should successfully update the shop', async () => {
            const shopId = 'existingShopId';
            const updatePayload = { name: 'Updated Shop' };

            shopRepoFindByIdStub.withArgs(shopId).resolves({ id: shopId });
            shopRepoUpdateByIdStub
                .withArgs(shopId, updatePayload)
                .resolves(true);

            req = { params: { id: shopId }, body: updatePayload } as Request<
                { id: string },
                never,
                UpdateShopPayload
            >;
            await updateShop(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindByIdStub.throws(new Error('Database error'));

            req = { params: { id: 'shopId' }, body: {} } as Request<
                { id: string },
                never,
                UpdateShopPayload
            >;
            await updateShop(req, res);
        });
    });

    describe('deleteShop', () => {
        let req: Request<{ id: string }>,
            res: Response<DeleteShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindByIdStub: sinon.SinonStub,
            shopRepoDeleteByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<DeleteShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
            shopRepoDeleteByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'deleteById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the shop is not found', async () => {
            shopRepoFindByIdStub.resolves(null);

            req = { params: { id: 'nonexistentShopId' } } as Request<{
                id: string;
            }>;
            await deleteShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should successfully delete the shop', async () => {
            const shopId = 'existingShopId';

            shopRepoFindByIdStub.withArgs(shopId).resolves({ id: shopId });
            shopRepoDeleteByIdStub.withArgs(shopId).resolves(true);

            req = { params: { id: shopId } } as Request<{ id: string }>;
            await deleteShop(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindByIdStub.throws(new Error('Database error'));

            req = { params: { id: 'shopId' } } as Request<{ id: string }>;
            await deleteShop(req, res);
        });
    });

    describe('updateOrder', () => {
        let req: Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >,
            res: Response<UpdateOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindByIdStub: sinon.SinonStub,
            orderRepoUpdateByIdStub: sinon.SinonStub,
            orderRepoSendEmailToUserStub: sinon.SinonStub,
            orderRepoSendEmailToShopStub: sinon.SinonStub,
            userRepoFindByIdStub: sinon.SinonStub,
            shopRepoFindByIdStub: sinon.SinonStub,
            mealRepoFindByIdStub: sinon.SinonStub,
            mealRepoUpdateByIdStub: sinon.SinonStub,
            orderItemRepoFindByOrderIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<UpdateOrderResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findById',
            );
            orderRepoUpdateByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'updateById',
            );
            orderRepoSendEmailToUserStub = sinon.stub(
                MongoOrderRepository.prototype,
                'sendEmailToUser',
            );
            orderRepoSendEmailToShopStub = sinon.stub(
                MongoOrderRepository.prototype,
                'sendEmailToShop',
            );
            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
            mealRepoFindByIdStub = sinon.stub(
                MongoMealRepository.prototype,
                'findById',
            );
            mealRepoUpdateByIdStub = sinon.stub(
                MongoMealRepository.prototype,
                'updateById',
            );
            orderItemRepoFindByOrderIdStub = sinon.stub(
                MongoOrderItemRepository.prototype,
                'findByOrderId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the order is not found', async () => {
            orderRepoFindByIdStub.resolves(null);

            req = {
                params: { order_id: 'nonexistentOrderId', shop_id: 'shopId' },
                body: { status: 'INPROGRESS' },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should return an error if there is a permission issue', async () => {
            orderRepoFindByIdStub.resolves({ shop_id: 'differentShopId' });

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: 'INPROGRESS' },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Permission denied' })).to.be
                .true;
        });

        it('should return an error if the payload is missing', async () => {
            orderRepoFindByIdStub.resolves({ shop_id: 'shopId' });

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: {},
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Payload is required' })).to.be
                .true;
        });

        it('should return an error if the status value is invalid', async () => {
            orderRepoFindByIdStub.resolves({ shop_id: 'shopId' });

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: 'INVALID_STATUS' },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Invalid status value' })).to.be
                .true;
        });

        it('should return an error if the user of the order is not found', async () => {
            orderRepoFindByIdStub.resolves({
                shop_id: 'shopId',
                user_id: 'nonexistentUserId',
            });
            userRepoFindByIdStub.resolves(null);

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({ error: 'User not found in cancelOrder' }),
            ).to.be.true;
        });

        it('should return an error if the shop of the order is not found', async () => {
            orderRepoFindByIdStub.resolves({
                shop_id: 'nonexistentShopId',
                user_id: 'userId',
            });
            userRepoFindByIdStub.resolves({
                id: 'userId',
                email: 'user@example.com',
            });
            shopRepoFindByIdStub.resolves(null);

            req = {
                params: { order_id: 'orderId', shop_id: 'nonexistentShopId' },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({ error: 'Shop not found in cancelOrder' }),
            ).to.be.true;
        });

        it('should return an error if the user of the shop is not found', async () => {
            const mockOrder = { shop_id: 'shopId', user_id: 'userId' };
            const mockShop = { id: 'shopId', user_id: 'shopOwnerId' };

            orderRepoFindByIdStub.resolves(mockOrder);
            userRepoFindByIdStub
                .withArgs('userId')
                .resolves({ id: 'userId', email: 'user@example.com' });
            userRepoFindByIdStub.withArgs('shopOwnerId').resolves(null);
            shopRepoFindByIdStub.resolves(mockShop);

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'UserId of Shop not found in UserDB in cancelOrder',
                }),
            ).to.be.true;
        });

        it('should return an error if a meal in the order does not exist', async () => {
            const mockOrderItems = [
                { meal_id: 'nonexistentMealId', quantity: 2 },
            ];

            orderRepoFindByIdStub.resolves({
                shop_id: 'shopId',
                user_id: 'userId',
            });
            userRepoFindByIdStub.resolves({
                id: 'userId',
                email: 'user@example.com',
            });
            shopRepoFindByIdStub.resolves({
                id: 'shopId',
                user_id: 'shopOwnerId',
            });
            orderItemRepoFindByOrderIdStub.resolves(mockOrderItems);
            mealRepoFindByIdStub.withArgs('nonexistentMealId').resolves(null);

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: OrderStatus.INPROGRESS },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: `Meal ${mockOrderItems[0].meal_id} does not exist`,
                }),
            ).to;
        });

        it('should return an error if stock is not enough', async () => {
            orderRepoFindByIdStub.resolves({
                shop_id: 'shopId',
                user_id: 'userId',
            });
            userRepoFindByIdStub.resolves({
                id: 'userId',
                email: 'user@example.com',
            });
            shopRepoFindByIdStub.resolves({
                id: 'shopId',
                user_id: 'shopOwnerId',
            });
            orderItemRepoFindByOrderIdStub.resolves([
                { meal_id: 'meal1', quantity: 5 },
            ]);
            mealRepoFindByIdStub.resolves({ id: 'meal1', quantity: 3 }); // 不足的库存

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: OrderStatus.INPROGRESS },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonSpy.calledWith({ error: 'Stock of meal1 is not enough' }),
            ).to.be.true;
        });

        it('should return an error if the update fails', async () => {
            const orderId = 'orderId';
            const shopId = 'shopId';
            const mealId = 'meal1';
            const orderItemQuantity = 2;
            const existingMealQuantity = 10;

            orderRepoFindByIdStub.resolves({
                shop_id: shopId,
                user_id: 'userId',
            });
            orderItemRepoFindByOrderIdStub
                .withArgs(orderId)
                .resolves([{ meal_id: mealId, quantity: orderItemQuantity }]);
            mealRepoFindByIdStub
                .withArgs(mealId)
                .resolves({ id: mealId, quantity: existingMealQuantity });
            mealRepoUpdateByIdStub.resolves(true);
            orderRepoUpdateByIdStub
                .withArgs(orderId, sinon.match.any)
                .resolves(false);
            orderRepoSendEmailToUserStub.resolves(true);
            orderRepoSendEmailToShopStub.resolves(true);

            req = {
                params: { order_id: orderId, shop_id: shopId },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(orderRepoUpdateByIdStub.calledWith(orderId, sinon.match.any))
                .to.be.true;

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Update fails' })).to.be.true;
        });

        it('should successfully update the order and meal quantity', async () => {
            const orderId = 'orderId';
            const shopId = 'shopId';
            const mealId = 'meal1';
            const orderItemQuantity = 2;
            const existingMealQuantity = 10;

            // 模拟订单、订单项和餐品数据
            orderRepoFindByIdStub.resolves({
                shop_id: shopId,
                user_id: 'userId',
            });
            orderItemRepoFindByOrderIdStub
                .withArgs(orderId)
                .resolves([{ meal_id: mealId, quantity: orderItemQuantity }]);
            mealRepoFindByIdStub
                .withArgs(mealId)
                .resolves({ id: mealId, quantity: existingMealQuantity });
            mealRepoUpdateByIdStub.resolves(true);
            orderRepoUpdateByIdStub
                .withArgs(orderId, sinon.match.any)
                .resolves(true);
            orderRepoSendEmailToUserStub.resolves(true);
            orderRepoSendEmailToShopStub.resolves(true);

            req = {
                params: { order_id: orderId, shop_id: shopId },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            const newMealQuantity = existingMealQuantity + orderItemQuantity; // 取消订单应该增加库存
            expect(
                mealRepoUpdateByIdStub.calledWith(mealId, {
                    quantity: newMealQuantity,
                }),
            ).to.be.true;

            expect(
                orderRepoUpdateByIdStub.calledWith(orderId, {
                    status: OrderStatus.CANCELLED,
                }),
            ).to.be.true;

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should handle exceptions', async () => {
            orderRepoFindByIdStub.throws(new Error('Database error'));

            req = {
                params: { order_id: 'orderId', shop_id: 'shopId' },
                body: { status: OrderStatus.CANCELLED },
            } as Request<
                { order_id: string; shop_id: string },
                never,
                UpdateOrderPayload
            >;
            await updateOrder(req, res);

            expect(statusStub.calledWith(500)).to.be.true; // 假设 genericErrorHandler 设置为返回 500 状态码
        });
    });

    describe('getRevenue', () => {
        let req: Request<{ shop_id: string; year: string; month: string }>,
            res: Response<{ balance: number } | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindByShopIdMonthStub: sinon.SinonStub,
            orderItemRepoFindByOrderIdStub: sinon.SinonStub,
            mealRepoFindByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<{ balance: number } | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByShopIdMonthStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findByShopIdMonth',
            );
            orderItemRepoFindByOrderIdStub = sinon.stub(
                MongoOrderItemRepository.prototype,
                'findByOrderId',
            );
            mealRepoFindByIdStub = sinon.stub(
                MongoMealRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if year or month are not numeric', async () => {
            req = {
                params: { shop_id: 'shopId' },
                query: { year: 'year2023', month: '13' },
            } as unknown as Request<{
                shop_id: string;
                year: string;
                month: string;
            }>;
            await getRevenue(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'Year and month should be numeric values.',
                }),
            ).to.be.true;
        });

        it('should return an error if the month is invalid', async () => {
            req = {
                params: { shop_id: 'shopId' },
                query: { year: '2023', month: '13' },
            } as unknown as Request<{
                shop_id: string;
                year: string;
                month: string;
            }>;
            await getRevenue(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'Invalid month. Month should be between 1 and 12.',
                }),
            ).to.be.true;
        });

        it('should correctly calculate the revenue', async () => {
            const mockOrders = [{ id: 'order1', status: OrderStatus.FINISHED }];
            const mockOrderItems = [
                { order_id: 'order1', meal_id: 'meal1', quantity: 2 },
            ];
            const mockMeal = { id: 'meal1', price: 100 };

            orderRepoFindByShopIdMonthStub.resolves(mockOrders);
            orderItemRepoFindByOrderIdStub.resolves(mockOrderItems);
            mealRepoFindByIdStub.resolves(mockMeal);

            req = {
                params: { shop_id: 'shopId' },
                query: { year: '2023', month: '5' },
            } as unknown as Request<{
                shop_id: string;
                year: string;
                month: string;
            }>;
            await getRevenue(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith({ balance: 200 })).to.be.true; // 100 * 2 = 200
        });

        it('should handle exceptions', async () => {
            orderRepoFindByShopIdMonthStub.throws(new Error('Database error'));

            req = {
                params: { shop_id: 'shopId' },
                query: { year: '2023', month: '5' },
            } as unknown as Request<{
                shop_id: string;
                year: string;
                month: string;
            }>;
            await getRevenue(req, res);
        });
    });
});
