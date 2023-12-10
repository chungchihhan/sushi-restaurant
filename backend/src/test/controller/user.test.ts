import type {
    CreateUserPayload,
    CreateUserResponse,
    GetUserResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { createUser, getUser } from '../../controllers/user';
import { MongoUserRepository } from '../../controllers/user_repository';
import UserModel from '../../models/user';
import redis from '../../utils/redis';

describe('User Controller', () => {
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
    });
});

// The test would not terminate if we don't quit the redis client.
redis?.quit();
