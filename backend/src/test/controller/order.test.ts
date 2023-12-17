import type {
    CreateOrderPayload,
    CreateOrderResponse,
    DeleteOrderResponse,
    GetOrderResponse,
    GetOrdersResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import {
    createOrder,
    deleteOrder,
    getOrder,
    getOrders,
} from '../../controllers/order';
import { MongoOrderItemRepository } from '../../controllers/orderItem_repository';
import { MongoOrderRepository } from '../../controllers/order_repository';
import { MongoShopRepository } from '../../controllers/shop_repository';
import { MongoUserRepository } from '../../controllers/user_repository';

describe('Order Controller', () => {
    describe('getOrders', () => {
        let orderRepoFindByUserIdMonthStub: sinon.SinonStub,
            orderRepoFindAllStub: sinon.SinonStub,
            req: Request,
            res: Response<GetOrdersResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetOrdersResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByUserIdMonthStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findByUserIdMonth',
            );
            orderRepoFindAllStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return all orders when no year and month provided', async () => {
            const mockOrders = [{ id: '1', user_id: 'user1' }];
            orderRepoFindAllStub.resolves(mockOrders);
            req = { body: {} } as Request;

            await getOrders(req, res);

            expect(orderRepoFindAllStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrders)).to.be.true;
        });

        it('should return orders of a user for a specific month and year', async () => {
            const mockOrders = [{ id: '2', user_id: 'user1' }];
            orderRepoFindByUserIdMonthStub.resolves(mockOrders);
            req = {
                body: { user_id: 'user1', year: '2021', month: '05' },
            } as Request;

            await getOrders(req, res);

            expect(orderRepoFindByUserIdMonthStub.calledWith('user1', 2021, 5))
                .to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrders)).to.be.true;
        });

        it('should return 404 if no orders found', async () => {
            orderRepoFindAllStub.resolves(null);
            req = { body: {} } as Request;

            await getOrders(req, res);

            expect(orderRepoFindAllStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Orders not found' })).to.be
                .true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            orderRepoFindAllStub.throws(error);
            req = { body: {} } as Request;

            await getOrders(req, res);
        });
    });

    describe('getOrder', () => {
        let orderRepoFindByIdStub: sinon.SinonStub,
            req: Request<{ id: string }>,
            res: Response<GetOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetOrderResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return a specific order', async () => {
            const mockOrder = { id: '1', user_id: 'user1' };
            orderRepoFindByIdStub.withArgs('1').resolves(mockOrder);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith('1')).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrder)).to.be.true;
        });

        it('should return 404 if the order is not found', async () => {
            orderRepoFindByIdStub.withArgs('1').resolves(null);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith('1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            orderRepoFindByIdStub.withArgs('1').throws(error);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);
        });
    });

    describe('createOrder', () => {
        let userRepoFindByIdStub: sinon.SinonStub,
            shopRepoFindByIdStub: sinon.SinonStub,
            mealRepoFindByIdStub: sinon.SinonStub,
            orderRepoCreateStub: sinon.SinonStub,
            orderItemRepoCreateStub: sinon.SinonStub,
            orderRepoFindDetailsByOrderIdStub: sinon.SinonStub,
            orderRepoSendEmailToShopStub: sinon.SinonStub,
            req: Request<never, never, CreateOrderPayload>,
            res: Response<CreateOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
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
            orderRepoCreateStub = sinon.stub(
                MongoOrderRepository.prototype,
                'create',
            );
            orderItemRepoCreateStub = sinon.stub(
                MongoOrderItemRepository.prototype,
                'create',
            );
            orderRepoFindDetailsByOrderIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findDetailsByOrderId',
            );
            orderRepoSendEmailToShopStub = sinon.stub(
                MongoOrderRepository.prototype,
                'sendEmailToShop',
            );

            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<CreateOrderResponse | { error: string }>;
            statusStub.returns(res);
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should successfully create an order', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves({ id: 'user1' });
            shopRepoFindByIdStub.withArgs('shop1').resolves({ id: 'shop1' });
            mealRepoFindByIdStub
                .withArgs('meal1')
                .resolves({ id: 'meal1', shop_id: 'shop1' });
            orderRepoCreateStub.resolves({ id: 'order1' });
            orderItemRepoCreateStub.resolves({});
            orderRepoFindDetailsByOrderIdStub
                .withArgs('order1')
                .resolves({ id: 'order1' });
            orderRepoSendEmailToShopStub.resolves(true);

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [{ meal_id: 'meal1', quantity: 2 }],
                },
            } as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(orderRepoCreateStub.calledOnce).to.be.true;
            expect(orderItemRepoCreateStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonSpy.calledWith({ id: 'order1' })).to.be.true;
        });

        it('should return 404 if the user is not found', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves(null);

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [],
                },
            } as unknown as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(userRepoFindByIdStub.calledWith('user1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return 404 if the shop is not found', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves({ id: 'user1' });
            shopRepoFindByIdStub.withArgs('shop1').resolves(null);

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [],
                },
            } as unknown as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(shopRepoFindByIdStub.calledWith('shop1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should return 404 if order creation fails', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves({ id: 'user1' });
            shopRepoFindByIdStub.withArgs('shop1').resolves({ id: 'shop1' });
            mealRepoFindByIdStub
                .withArgs('meal1')
                .resolves({ id: 'meal1', shop_id: 'shop1' });
            orderRepoCreateStub.resolves(null);

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [{ meal_id: 'meal1', quantity: 2 }],
                },
            } as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(userRepoFindByIdStub.calledWith('user1')).to.be.true;
            expect(shopRepoFindByIdStub.calledWith('shop1')).to.be.true;
            expect(orderRepoCreateStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order creation failed' })).to.be
                .true;
        });

        it('should return 404 if a meal in order items is not found', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves({ id: 'user1' });
            shopRepoFindByIdStub.withArgs('shop1').resolves({ id: 'shop1' });
            orderRepoCreateStub.resolves(true);
            mealRepoFindByIdStub.withArgs('meal1').resolves(null);

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [{ meal_id: 'meal1', quantity: 2 }],
                },
            } as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(userRepoFindByIdStub.calledWith('user1')).to.be.true;
            expect(shopRepoFindByIdStub.calledWith('shop1')).to.be.true;
            expect(mealRepoFindByIdStub.calledWith('meal1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: `Meal meal1 not found' ` })).to
                .be.true;
        });

        it('should return 404 if a meal in order items is not found in the specified shop', async () => {
            userRepoFindByIdStub.withArgs('user1').resolves({ id: 'user1' });
            shopRepoFindByIdStub.withArgs('shop1').resolves({ id: 'shop1' });
            orderRepoCreateStub.resolves(true);
            mealRepoFindByIdStub
                .withArgs('meal1')
                .resolves({ id: 'meal1', shop_id: 'shop2' }); // Meal belongs to a different shop

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [{ meal_id: 'meal1', quantity: 2 }],
                },
            } as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);

            expect(mealRepoFindByIdStub.calledWith('meal1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: `Meal meal1 not found in shop shop1`,
                }),
            ).to.be.true;
        });

        it('should handle unexpected exceptions', async () => {
            const error = new Error('Unexpected error');
            userRepoFindByIdStub.withArgs('user1').throws(error); // Simulate an unexpected error

            req = {
                body: {
                    user_id: 'user1',
                    shop_id: 'shop1',
                    order_items: [],
                },
            } as unknown as Request<never, never, CreateOrderPayload>;

            await createOrder(req, res);
        });
    });

    describe('deleteOrder', () => {
        let orderRepoFindByIdStub: sinon.SinonStub,
            orderRepoDeleteByIdStub: sinon.SinonStub,
            req: Request<{ id: string }>,
            res: Response<DeleteOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<DeleteOrderResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findById',
            );
            orderRepoDeleteByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'deleteById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should successfully delete an order', async () => {
            const orderId = '1';
            orderRepoFindByIdStub.withArgs(orderId).resolves({ id: orderId });
            orderRepoDeleteByIdStub.withArgs(orderId).resolves(true);

            req = { params: { id: orderId } } as Request<{ id: string }>;

            await deleteOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith(orderId)).to.be.true;
            expect(orderRepoDeleteByIdStub.calledWith(orderId)).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should return 404 if the order is not found', async () => {
            const orderId = '1';
            orderRepoFindByIdStub.withArgs(orderId).resolves(null);

            req = { params: { id: orderId } } as Request<{ id: string }>;

            await deleteOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith(orderId)).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should return 404 if deletion fails', async () => {
            const orderId = '1';
            orderRepoFindByIdStub.withArgs(orderId).resolves({ id: orderId });
            orderRepoDeleteByIdStub.withArgs(orderId).resolves(false);

            req = { params: { id: orderId } } as Request<{ id: string }>;

            await deleteOrder(req, res);

            expect(orderRepoDeleteByIdStub.calledWith(orderId)).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Delete fails' })).to.be.true;
        });

        it('should handle unexpected exceptions', async () => {
            const error = new Error('Unexpected error');
            const orderId = '1';
            orderRepoFindByIdStub.withArgs(orderId).throws(error);

            req = { params: { id: orderId } } as Request<{ id: string }>;

            await deleteOrder(req, res);
        });
    });
});
