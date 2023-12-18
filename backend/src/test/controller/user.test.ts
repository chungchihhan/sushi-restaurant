import type {
    CancelOrderPayload,
    CreateUserPayload,
    CreateUserResponse,
    GetOrderDetailsPayload,
    GetOrderDetailsResponse,
    GetOrdersByUserIdResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateOrderResponse,
    UpdateUserPayload,
    deleteUserResponse,
    updateUserResponse,
    userLoginPayload,
    userLoginResponse,
} from '@lib/shared_types';
import bcrypt from 'bcrypt';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import { MongoOrderItemRepository } from '../../controllers/orderItem_repository';
import { MongoOrderRepository } from '../../controllers/order_repository';
import { MongoShopRepository } from '../../controllers/shop_repository';
import {
    cancelOrder,
    createUser,
    deleteUser,
    getBalance,
    getOrderDetails,
    getOrdersByUserId,
    getUser,
    getUsers,
    updateUser,
    userLogin,
} from '../../controllers/user';
import { MongoUserRepository } from '../../controllers/user_repository';
import UserModel from '../../models/user';

describe('User Controller', () => {
    describe('getUsers', () => {
        let res: Response<GetUsersResponse>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            userRepofindAllStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetUsersResponse>;
            statusStub.returns(res);

            userRepofindAllStub = sinon.stub(
                MongoUserRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return all users', async () => {
            const mockUsers = [
                {
                    id: 'testId1',
                    account: 'testAccount',
                    password: 'testPassword',
                    username: 'testUsername',
                    email: 'testEmail@gmail.com',
                    phone: '0912345678',
                    role: 'User',
                    birthday: '2000-01-01',
                    verified: 'true',
                    created_at: '2023-12-01',
                    last_login: '2023-12-10',
                },
                {
                    id: 'testId2',
                    account: 'testAccount',
                    password: 'testPassword',
                    username: 'testUsername',
                    email: 'testEmail@gmail.com',
                    phone: '0912345678',
                    role: 'User',
                    birthday: '2000-01-01',
                    verified: 'true',
                    created_at: '2023-12-01',
                    last_login: '2023-12-10',
                },
            ];
            userRepofindAllStub.resolves(mockUsers);

            await getUsers({} as Request, res as Response);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockUsers)).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepofindAllStub.throws(error);

            await getUsers({} as Request, res as Response);
        });
    });

    describe('getUser', () => {
        let statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            req: Request<{ id: string }>,
            res: Response<GetUserResponse | { error: string }>,
            userRepoFindByIdStub: sinon.SinonStub;

        beforeEach(() => {
            req = {
                params: {
                    id: 'testId',
                },
            } as Request<{ id: string }>;

            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetUserResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return user data if the user exists', async () => {
            const mockUser = {
                id: 'testId',
                account: 'testAccount',
                password: 'testPassword',
                username: 'testUsername',
                email: 'testEmail@gmail.com',
                phone: '0912345678',
                role: 'User',
                birthday: '2000-01-01',
                verified: 'true',
                created_at: '2023-12-01',
                last_login: '2023-12-10',
            };
            userRepoFindByIdStub.resolves(mockUser);

            await getUser(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockUser)).to.be.true;
        });

        it('should return an error if the user does not exist', async () => {
            userRepoFindByIdStub.resolves(null);

            await getUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepoFindByIdStub.throws(error);

            await getUser(req, res);
        });
    });

    describe('createUser', () => {
        let statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            req: Request<never, never, CreateUserPayload>,
            res: Response<CreateUserResponse | { error: string }>,
            userRepoFindByAccountStub: sinon.SinonStub;

        beforeEach(() => {
            req = {
                body: {
                    account: 'testAccount',
                    username: 'testUser',
                    password: 'password',
                    email: 'test@example.com',
                    phone: '1234567890',
                    role: 'user',
                    birthday: '2000-01-01',
                },
            } as Request<never, never, CreateUserPayload>;

            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<CreateUserResponse | { error: string }>;
            statusStub.returns(res);
            userRepoFindByAccountStub = sinon.stub(
                MongoUserRepository.prototype,
                'findByAccount',
            );
            sinon.stub(UserModel.prototype, 'save').resolves({ id: 'some-id' });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should create a new user if the account does not exist', async () => {
            userRepoFindByAccountStub.resolves(null);

            await createUser(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonSpy.calledWith({ id: 'some-id' })).to.be.true;
        });

        it('should return an error if the user already exists', async () => {
            userRepoFindByAccountStub.resolves(!null);

            await createUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User already exists' })).to.be
                .true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepoFindByAccountStub.throws(error);

            await createUser(req, res);
        });
    });

    describe('updateUser', () => {
        let req: Request<{ id: string }, never, UpdateUserPayload>,
            res: Response<updateUserResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy = sinon.spy(),
            userRepoFindByIdStub: sinon.SinonStub,
            userRepoUpdateByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<updateUserResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            userRepoUpdateByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'updateById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should update the user successfully if the user exists', async () => {
            const userId = 'testId';
            userRepoFindByIdStub.resolves({ id: userId, name: 'User One' });
            userRepoUpdateByIdStub.resolves(true);

            req = {
                params: { id: userId },
                body: { name: 'Updated User' },
            } as unknown as Request<{ id: string }, never, UpdateUserPayload>;

            await updateUser(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should return an error if the user does not exist', async () => {
            const userId = 'nonexistId';
            userRepoFindByIdStub.resolves(null);

            req = { params: { id: userId }, body: {} } as unknown as Request<
                { id: string },
                never,
                UpdateUserPayload
            >;

            await updateUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return an error if the update fails', async () => {
            const userId = 'testId';
            userRepoFindByIdStub.resolves({ id: userId, name: 'User One' });
            userRepoUpdateByIdStub.resolves(false);

            req = {
                params: { id: userId },
                body: { name: 'Updated User' },
            } as unknown as Request<{ id: string }, never, UpdateUserPayload>;

            await updateUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Update fails' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepoFindByIdStub.throws(error);

            await updateUser(req, res);
        });
    });

    describe('deleteUser', () => {
        let req: Request<{ id: string }>,
            res: Response<deleteUserResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy,
            userRepoFindByIdStub: sinon.SinonStub,
            userRepoDeleteByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                send: sendSpy,
                json: jsonSpy,
            } as unknown as Response<deleteUserResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            userRepoDeleteByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'deleteById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should delete the user successfully if the user exists', async () => {
            const userId = 'testId';
            userRepoFindByIdStub.resolves({ id: userId });
            userRepoDeleteByIdStub.resolves(true);

            req = {
                params: { id: userId },
            } as unknown as Request<{ id: string }>;

            await deleteUser(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should return an error if the user does not exist', async () => {
            const userId = 'nonexistId';
            userRepoFindByIdStub.resolves(null);

            req = { params: { id: userId } } as unknown as Request<{
                id: string;
            }>;

            await deleteUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return an error if the delete fails', async () => {
            const userId = 'testId';
            userRepoFindByIdStub.resolves({ id: userId });
            userRepoDeleteByIdStub.resolves(false);

            req = {
                params: { id: userId },
            } as unknown as Request<{ id: string }>;

            await deleteUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Delete fails' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepoFindByIdStub.throws(error);

            await deleteUser(req, res);
        });
    });

    describe('getOrdersByUserId', () => {
        let req: Request<{ user_id: string }>,
            res: Response<GetOrdersByUserIdResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindByUserIdStub: sinon.SinonStub,
            shopRepoFindByIdStub: sinon.SinonStub,
            orderItemRepoFindByOrderIdStub: sinon.SinonStub,
            mealRepoFindByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<
                GetOrdersByUserIdResponse | { error: string }
            >;
            statusStub.returns(res);

            orderRepoFindByUserIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findByUserId',
            );
            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
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

        it('should return order history for a user', async () => {
            const userId = '123';
            const mockOrders = [
                {
                    id: 'order1',
                    shop_id: 'shop1',
                    status: 'completed',
                    order_date: '2023-12-03',
                },
            ];
            const mockShop = {
                id: 'shop1',
                name: 'Test Shop',
                image: 'shop_image.jpg',
            };
            const mockOrderItems = [
                { order_id: 'order1', meal_id: 'meal1', quantity: 2 },
            ];
            const mockMeal = { id: 'meal1', price: 100 };

            orderRepoFindByUserIdStub.resolves(mockOrders);
            shopRepoFindByIdStub.withArgs('shop1').resolves(mockShop);
            orderItemRepoFindByOrderIdStub
                .withArgs('order1')
                .resolves(mockOrderItems);
            mealRepoFindByIdStub.withArgs('meal1').resolves(mockMeal);

            req = { params: { user_id: userId } } as unknown as Request<{
                user_id: string;
            }>;

            await getOrdersByUserId(
                req as Request<{ user_id: string }>,
                res as Response,
            );

            const expectedOrderHistory = mockOrders.map((order) => ({
                order_id: order.id,
                status: order.status,
                order_date: order.order_date,
                order_price: mockOrderItems.reduce((sum, item) => {
                    return sum + mockMeal.price * item.quantity;
                }, 0),
                shop_name: mockShop.name,
                shop_image: mockShop.image,
            }));

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(expectedOrderHistory)).to.be.true;
        });

        it('should throw an error if the shop is not found for an order', async () => {
            const userId = '123';
            const mockOrders = [
                {
                    id: 'order1',
                    shop_id: 'shop1',
                    status: 'completed',
                    order_date: '2023-12-03',
                },
            ];

            orderRepoFindByUserIdStub.resolves(mockOrders);
            shopRepoFindByIdStub.withArgs('shop1').resolves(null);

            req = { params: { user_id: userId } } as unknown as Request<{
                user_id: string;
            }>;

            try {
                await getOrdersByUserId(
                    req as Request<{ user_id: string }>,
                    res as Response,
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).to.equal(`Shop not found for order order1`);
            }
        });
    });

    describe('userLogin', () => {
        let req: Request<userLoginPayload>,
            res: Response<userLoginResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            userRepoFindByAccountStub: sinon.SinonStub,
            jwtSignStub: sinon.SinonStub,
            shopRepoFindByUserIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<userLoginResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByAccountStub = sinon.stub(
                MongoUserRepository.prototype,
                'findByAccount',
            );
            jwtSignStub = sinon.stub(jwt, 'sign');
            shopRepoFindByUserIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findByUserId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should log in the user successfully if role is user', async () => {
            const password = 'password';
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const mockUser = {
                id: '123',
                account: 'user',
                password: hashedPassword,
                role: '用戶',
            };
            userRepoFindByAccountStub.withArgs('user').resolves(mockUser);
            jwtSignStub.returns('mock_token');
            shopRepoFindByUserIdStub.withArgs('123').resolves(null);

            req = {
                body: { account: 'user', password: password },
            } as Request<userLoginPayload>;

            await userLogin(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    id: '123',
                    token: 'mock_token',
                    shop_id: 'none',
                }),
            ).to.be.true;
        });

        it('should log in the user successfully if role is shop', async () => {
            const password = 'password';
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const mockUser = {
                id: '123',
                account: 'user',
                password: hashedPassword,
                role: '店家',
            };

            const mockShop = [
                {
                    id: 'shop1',
                    user_id: '123',
                },
            ];
            userRepoFindByAccountStub.withArgs('user').resolves(mockUser);
            jwtSignStub.returns('mock_token');
            shopRepoFindByUserIdStub.withArgs('123').resolves(mockShop);

            req = {
                body: { account: 'user', password: password },
            } as Request<userLoginPayload>;

            await userLogin(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    id: '123',
                    token: 'mock_token',
                    shop_id: mockShop[0].id,
                }),
            ).to.be.true;
        });

        it('should return an error if the user is not found', async () => {
            userRepoFindByAccountStub.withArgs('user').resolves(null);

            req = {
                body: { account: 'user', password: 'pass' },
            } as Request<userLoginPayload>;

            await userLogin(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return an error if the password is wrong', async () => {
            const password = 'password';
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const mockUser = {
                id: '123',
                account: 'user',
                password: hashedPassword,
            };
            userRepoFindByAccountStub.withArgs('user').resolves(mockUser);

            req = {
                body: { account: 'user', password: 'wrong' },
            } as Request<userLoginPayload>;

            await userLogin(req, res);

            expect(statusStub.calledWith(401)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Wrong password' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            userRepoFindByAccountStub.throws(error);

            await userLogin(req, res);
        });
    });

    describe('getOrderDetails', () => {
        let req: Request<GetOrderDetailsPayload>,
            res: Response<GetOrderDetailsResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindDetailsByOrderIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<
                GetOrderDetailsResponse | { error: string }
            >;
            statusStub.returns(res);

            orderRepoFindDetailsByOrderIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findDetailsByOrderId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return order details successfully', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockOrderDetails = {
                id: 'order1',
                user_id: 'user1',
                status: 'waiting',
                date: '2023-12-03',
                order_items: {},
                shop_name: 'shop1',
            };
            orderRepoFindDetailsByOrderIdStub
                .withArgs(orderId)
                .resolves(mockOrderDetails);

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<GetOrderDetailsPayload>;

            await getOrderDetails(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrderDetails)).to.be.true;
        });

        it('should return an error if the order is not found', async () => {
            const orderId = 'order1';
            orderRepoFindDetailsByOrderIdStub.withArgs(orderId).resolves(null);

            req = {
                params: { id: orderId, user_id: 'user1' },
            } as Request<GetOrderDetailsPayload>;

            await getOrderDetails(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should return an error if the user_id does not match', async () => {
            const orderId = 'order1';
            const mockOrderDetails = {
                id: 'order2',
                user_id: 'user2',
                status: 'waiting',
                date: '2023-12-03',
                order_items: {},
                shop_name: 'shop2',
            };
            orderRepoFindDetailsByOrderIdStub
                .withArgs(orderId)
                .resolves(mockOrderDetails);

            req = {
                params: { id: orderId, user_id: 'user1' },
            } as Request<GetOrderDetailsPayload>;

            await getOrderDetails(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Permission denied' })).to.be
                .true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            orderRepoFindDetailsByOrderIdStub.throws(error);

            await getOrderDetails(req, res);
        });
    });

    describe('cancelOrder', () => {
        let req: Request<CancelOrderPayload>,
            res: Response<UpdateOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            sendSpy: sinon.SinonSpy,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindByIdStub: sinon.SinonStub,
            userRepoFindByIdStub: sinon.SinonStub,
            shopRepoFindByIdStub: sinon.SinonStub,
            orderItemRepoFindByOrderIdStub: sinon.SinonStub,
            mealRepoFindByIdStub: sinon.SinonStub,
            mealRepoUpdateByIdStub: sinon.SinonStub,
            sendEmailToUserStub: sinon.SinonStub,
            sendEmailToShopStub: sinon.SinonStub,
            orderRepoUpdateByIdStub: sinon.SinonStub,
            orderRepoFindDetailsByOrderIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            sendSpy = sinon.spy();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
                send: sendSpy,
            } as unknown as Response<UpdateOrderResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findById',
            );
            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
            orderItemRepoFindByOrderIdStub = sinon.stub(
                MongoOrderItemRepository.prototype,
                'findByOrderId',
            );
            mealRepoFindByIdStub = sinon.stub(
                MongoMealRepository.prototype,
                'findById',
            );
            mealRepoUpdateByIdStub = sinon.stub(
                MongoMealRepository.prototype,
                'updateById',
            );
            sendEmailToUserStub = sinon.stub(
                MongoOrderRepository.prototype,
                'sendEmailToUser',
            );
            sendEmailToShopStub = sinon.stub(
                MongoOrderRepository.prototype,
                'sendEmailToShop',
            );
            orderRepoUpdateByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'updateById',
            );
            orderRepoFindDetailsByOrderIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findDetailsByOrderId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the order is not found', async () => {
            const orderId = 'order1';
            orderRepoFindByIdStub.withArgs(orderId).resolves(null);

            req = {
                params: { id: orderId, user_id: 'user1' },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should return an error if the user_id does not match', async () => {
            const orderId = 'order1';
            const mockOrder = {
                id: orderId,
                user_id: 'user2',
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };
            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);

            req = {
                params: { id: orderId, user_id: 'user1' },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Permission denied' })).to.be
                .true;
        });

        it('should return an error if the user is not found', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(null); // 用户未找到

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({ error: 'User not found in cancelOrder' }),
            ).to.be.true;
        });

        it('should return an error if the shop is not found', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                // other user info
            };

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(mockUser);
            shopRepoFindByIdStub.withArgs('shop1').resolves(null);

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({ error: 'Shop not found in cancelOrder' }),
            ).to.be.true;
        });

        it('should return an error if the shop owner user is not found', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                // other user info
            };
            const mockShop = {
                id: 'shop1',
                user_id: 'shopOwner1',
                // other shop info
            };

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(mockUser);
            shopRepoFindByIdStub.withArgs('shop1').resolves(mockShop);
            userRepoFindByIdStub.withArgs('shopOwner1').resolves(null); // 商店所有者用户未找到

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(403)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'UserId of Shop not found in UserDB in cancelOrder',
                }),
            ).to.be.true;
        });

        it('should return an error if a meal does not exist', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                // other user info
            };
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };
            const mockShop = {
                id: 'shop1',
                user_id: 'shopOwner1',
                // other shop info
            };
            const mockOrderItems = [
                { order_id: orderId, meal_id: 'meal1', quantity: 2 },
                // other orderItem
            ];
            const mockShopOwner = {
                id: 'shopOwner1',
                email: 'user2@example.com',
                // other user info
            };

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(mockUser);
            shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);
            userRepoFindByIdStub
                .withArgs(mockShop.user_id)
                .resolves(mockShopOwner);
            orderItemRepoFindByOrderIdStub
                .withArgs(orderId)
                .resolves(mockOrderItems);
            mealRepoFindByIdStub.withArgs('meal1').resolves(null); // 餐点不存在

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Meal meal1 does not exist' }))
                .to.be.true;
        });

        it('should return an error if the order update fails', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                // ...其他订单数据...
            };
            const mockUser = {
                id: userId,
                email: 'user@example.com',
                // ...其他用户数据...
            };
            const mockShop = {
                id: 'shop1',
                user_id: 'shopOwner1',
                // ...其他商店数据...
            };
            const mockOrderItems = [
                { order_id: orderId, meal_id: 'meal1', quantity: 2 },
                // other orderItem
            ];
            const mockShopOwner = {
                id: 'shopOwner1',
                email: 'user2@example.com',
                // other user info
            };

            const mockMeal = {
                id: 'meal1',
                shop_id: 'shop1',
                name: 'shopName',
                description: 'none',
                price: 100,
                quantity: 1,
                category: 'sushi',
                image: 'http',
            };

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(mockUser);
            shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);
            userRepoFindByIdStub
                .withArgs(mockShop.user_id)
                .resolves(mockShopOwner);
            orderItemRepoFindByOrderIdStub
                .withArgs(orderId)
                .resolves(mockOrderItems);
            mealRepoFindByIdStub.withArgs('meal1').resolves(mockMeal);
            orderRepoUpdateByIdStub
                .withArgs(orderId, sinon.match.any)
                .resolves(false); // 模拟更新失败

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Update fails' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            orderRepoFindByIdStub.throws(error);

            await cancelOrder(req, res);
        });

        it('should cancel the order successfully', async () => {
            const orderId = 'order1';
            const userId = 'user1';
            const shopOwnerId = 'shopOwner1';
            const mealId = 'meal1';
            const mockOrder = {
                id: orderId,
                user_id: userId,
                shop_id: 'shop1',
                status: 'waiting',
                order_date: '2023-12-03',
            };
            const mockUser = {
                id: userId,
                email: 'user@example.com',
            };
            const mockShop = {
                id: 'shop1',
                user_id: shopOwnerId,
            };
            const mockShopOwner = {
                id: shopOwnerId,
                email: 'shop@example.com',
            };
            const mockMeal = {
                id: mealId,
                quantity: 10,
            };
            const mockOrderItems = [
                { order_id: orderId, meal_id: mealId, quantity: 2 },
            ];
            const newStock = mockMeal.quantity + mockOrderItems[0].quantity;

            orderRepoFindByIdStub.withArgs(orderId).resolves(mockOrder);
            userRepoFindByIdStub.withArgs(userId).resolves(mockUser);
            userRepoFindByIdStub
                .withArgs(mockShop.user_id)
                .resolves(mockShopOwner);
            shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);
            mealRepoFindByIdStub.withArgs('meal1').resolves(mockMeal);
            orderItemRepoFindByOrderIdStub
                .withArgs(orderId)
                .resolves(mockOrderItems);
            mealRepoUpdateByIdStub.resolves(true);
            orderRepoUpdateByIdStub.resolves(true);
            sendEmailToUserStub.resolves(true);
            sendEmailToShopStub.resolves(true);
            orderRepoFindDetailsByOrderIdStub
                .withArgs(orderId)
                .resolves({ id: 'order1' });

            req = {
                params: { id: orderId, user_id: userId },
            } as Request<CancelOrderPayload>;

            await cancelOrder(req, res);

            expect(
                mealRepoUpdateByIdStub.calledWith('meal1', {
                    quantity: newStock,
                }),
            ).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });
    });

    describe('getBalance', () => {
        let req: Request<{ user_id: string; year: string; month: string }>,
            res: Response<{ balance: number } | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            orderRepoFindByUserIdMonthStub: sinon.SinonStub,
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

            orderRepoFindByUserIdMonthStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findByUserIdMonth',
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
                params: { user_id: 'user1' },
                query: { year: 'abc', month: 'xyz' },
            } as unknown as Request<{
                user_id: string;
                year: string;
                month: string;
            }>;

            await getBalance(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'Year and month should be numeric values.',
                }),
            ).to.be.true;
        });

        it('should return an error if the month is invalid', async () => {
            req = {
                params: { user_id: 'user1' },
                query: { year: '2023', month: '13' },
            } as unknown as Request<{
                user_id: string;
                year: string;
                month: string;
            }>;
            await getBalance(req, res);

            expect(statusStub.calledWith(400)).to.be.true;
            expect(
                jsonSpy.calledWith({
                    error: 'Invalid month. Month should be between 1 and 12.',
                }),
            ).to.be.true;
        });

        it('should return a balance of 0 if no orders are found', async () => {
            orderRepoFindByUserIdMonthStub.resolves([]);
            req = {
                params: { user_id: 'user1' },
                query: { year: '2023', month: '12' },
            } as unknown as Request<{
                user_id: string;
                year: string;
                month: string;
            }>;
            await getBalance(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith({ balance: 0 })).to.be.true;
        });

        it('should return a balance of 0 if no orders are finished', async () => {
            const mockOrders = [
                { id: 'order1', user_id: 'user1', status: 'waiting' },
            ];
            orderRepoFindByUserIdMonthStub
                .withArgs('user1', sinon.match.any, sinon.match.any)
                .resolves(mockOrders);

            req = {
                params: { user_id: 'user1' },
                query: { year: '2023', month: '12' },
            } as unknown as Request<{
                user_id: string;
                year: string;
                month: string;
            }>;
            await getBalance(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith({ balance: 0 })).to.be.true;
        });

        it('should calculate and return the total balance for finished orders', async () => {
            const mockOrders = [
                { id: 'order1', user_id: 'user1', status: 'finished' },
            ];
            const mockOrderItems = [
                { order_id: 'order1', meal_id: 'meal1', quantity: 2 },
            ];
            const mockMeal = { id: 'meal1', price: 100 };

            orderRepoFindByUserIdMonthStub
                .withArgs('user1', sinon.match.any, sinon.match.any)
                .resolves(mockOrders);
            orderItemRepoFindByOrderIdStub
                .withArgs('order1')
                .resolves(mockOrderItems);
            mealRepoFindByIdStub.withArgs('meal1').resolves(mockMeal);

            req = {
                params: { user_id: 'user1' },
                query: { year: '2023', month: '12' },
            } as unknown as Request<{
                user_id: string;
                year: string;
                month: string;
            }>;
            await getBalance(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith({ balance: 200 })).to.be.true; // 100 * 2 = 200
        });

        it('should handle errors', async () => {
            const error = new Error('Error fetching users');
            orderRepoFindByUserIdMonthStub.throws(error);

            await getBalance(req, res);
        });
    });
});
