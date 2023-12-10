import type {
    CreateUserPayload,
    CreateUserResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdateUserPayload,
    updateUserResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { createUser, getUser, getUsers, updateUser } from '../../controllers/user';
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

            userRepoFindByIdStub = sinon.stub(MongoUserRepository.prototype, 'findById');
            userRepoUpdateByIdStub = sinon.stub(MongoUserRepository.prototype, 'updateById');
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
                body: { name: 'Updated User' }
            } as unknown as Request<{ id: string }, never, UpdateUserPayload>;

            await updateUser(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(sendSpy.calledWith('OK')).to.be.true;
        });

        it('should return an error if the user does not exist', async () => {
            const userId = 'nonexistId';
            userRepoFindByIdStub.resolves(null);

            req = { params: { id: userId }, body: {} } as unknown as Request<{ id: string }, never, UpdateUserPayload>;

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
                body: { name: 'Updated User' }
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
});

// The test would not terminate if we don't quit the redis client.
redis?.quit();
