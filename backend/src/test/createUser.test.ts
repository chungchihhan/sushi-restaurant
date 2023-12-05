import type { CreateUserPayload, CreateUserResponse } from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { createUser } from '../controllers/user';
import { MongoUserRepository } from '../controllers/user_repository';
import UserModel from '../models/user';

describe('User Controller', () => {
    describe('createUser', () => {
        let statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            req: Request<never, never, CreateUserPayload>,
            res: Response<CreateUserResponse | { error: string }>,
            userRepoStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<CreateUserResponse | { error: string }>;
            statusStub.returns(res);

            userRepoStub = sinon.stub(
                MongoUserRepository.prototype,
                'findByAccount',
            );
            sinon.stub(UserModel.prototype, 'save').resolves({ id: 'some-id' });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should create a new user if the account does not exist', async () => {
            userRepoStub.resolves(null);

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

            await createUser(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonSpy.calledWith(sinon.match.has('id'))).to.be.true;
        });

        it('should return an error if the user already exists', async () => {
            userRepoStub.resolves(!null);

            req = {
                body: {
                    account: 'existingAccount',
                    username: 'existingUser',
                    password: 'password',
                    email: 'test@example.com',
                    phone: '1234567890',
                    role: 'user',
                    birthday: '2000-01-01',
                },
            } as Request<never, never, CreateUserPayload>;

            await createUser(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User already exists' })).to.be
                .true;
        });
    });
});
