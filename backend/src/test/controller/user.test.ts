import type {
    CreateUserPayload,
    CreateUserResponse,
    GetOrdersByUserIdResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
    deleteUserResponse,
    updateUserResponse,
    userLoginPayload,
    userLoginResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import { MongoOrderItemRepository } from '../../controllers/orderItem_repository';
import { MongoOrderRepository } from '../../controllers/order_repository';
import { MongoShopRepository } from '../../controllers/shop_repository';
import {
    createUser,
    deleteUser,
    getOrdersByUserId,
    getUser,
    getUsers,
    updateUser,
    userLogin,
} from '../../controllers/user';
import { MongoUserRepository } from '../../controllers/user_repository';
import UserModel from '../../models/user';
import redis from '../../utils/redis';

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

    describe('User Controller', () => {
        describe('userLogin', () => {
            let req: Request<userLoginPayload>,
                res: Response<userLoginResponse | { error: string }>,
                statusStub: sinon.SinonStub,
                jsonSpy: sinon.SinonSpy,
                userRepoFindByAccountStub: sinon.SinonStub,
                jwtSignStub: sinon.SinonStub;

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
            });

            afterEach(() => {
                sinon.restore();
            });

            it('should log in the user successfully', async () => {
                const mockUser = {
                    id: '123',
                    account: 'user',
                    password: 'pass',
                };
                userRepoFindByAccountStub.withArgs('user').resolves(mockUser);
                jwtSignStub.returns('mock_token');

                req = {
                    body: { account: 'user', password: 'pass' },
                } as Request<userLoginPayload>;

                await userLogin(req, res);

                expect(statusStub.calledWith(200)).to.be.true;
                expect(jsonSpy.calledWith({ id: '123', token: 'mock_token' }))
                    .to.be.true;
            });

            it('should return an error if the user is not found', async () => {
                userRepoFindByAccountStub.withArgs('user').resolves(null);

                req = {
                    body: { account: 'user', password: 'pass' },
                } as Request<userLoginPayload>;

                await userLogin(req, res);

                expect(statusStub.calledWith(404)).to.be.true;
                expect(jsonSpy.calledWith({ error: 'User not found' })).to.be
                    .true;
            });

            it('should return an error if the password is wrong', async () => {
                const mockUser = {
                    id: '123',
                    account: 'user',
                    password: 'wrong',
                };
                userRepoFindByAccountStub.withArgs('user').resolves(mockUser);

                req = {
                    body: { account: 'user', password: 'pass' },
                } as Request<userLoginPayload>;

                await userLogin(req, res);

                expect(statusStub.calledWith(404)).to.be.true;
                expect(jsonSpy.calledWith({ error: 'Wrong password' })).to.be
                    .true;
            });

            it('should handle errors', async () => {
                const error = new Error('Error fetching users');
                userRepoFindByAccountStub.throws(error);

                await userLogin(req, res);
            });
        });
    });
});

// The test would not terminate if we don't quit the redis client.
redis?.quit();
