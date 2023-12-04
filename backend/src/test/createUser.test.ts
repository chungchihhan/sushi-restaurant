import { expect } from 'chai';
import sinon from 'sinon';
import { createUser } from '../controllers/user'; // 請根據實際路徑調整
import { MongoUserRepository } from '../controllers/user_repository';
import UserModel from '../models/user';

describe('User Controller', () => {
    describe('createUser', () => {
        let status: any, json: any, req: any, res: any, userRepoStub: any, saveStub: any;

        beforeEach(() => {
            status = sinon.stub();
            json = sinon.spy();
            res = { status, json: (...args: any[]) => { json(...args); return res; }};
            status.returns(res);

            userRepoStub = sinon.stub(MongoUserRepository.prototype, 'findByAccount');
            saveStub = sinon.stub(UserModel.prototype, 'save').resolves({ id: 'some-id' });
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
                    birthday: '2000-01-01'
                }
            };

            await createUser(req, res);


            expect(status.calledWith(201)).to.be.true;
            expect(json.calledWith(sinon.match.has('id'))).to.be.true;
        });

        it('should return an error if the user already exists', async () => {
            userRepoStub.resolves({
                account: 'existingAccount',
                username: 'existingUser',
                password: 'password',
                email: 'test@example.com',
                phone: '1234567890',
                role: 'user',
                birthday: '2000-01-01'
            });

            req = {
                body: {
                    account: 'existingAccount',
                    username: 'existingUser',
                    password: 'password',
                    email: 'test@example.com',
                    phone: '1234567890',
                    role: 'user',
                    birthday: '2000-01-01'
                }
            };

            await createUser(req, res);

            expect(status.calledWith(404)).to.be.true;
            expect(json.calledWith({ error: 'User already exists' })).to.be.true;
        });

    });
});

