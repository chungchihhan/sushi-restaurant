import { expect } from 'chai';
import sinon from 'sinon';

import { MongoUserRepository } from '../../controllers/user_repository';
import UserModel from '../../models/user';

describe('MongoUserRepository', () => {
    let userRepository: MongoUserRepository,
        findStub: sinon.SinonStub,
        findByIdStub: sinon.SinonStub,
        findOneStub: sinon.SinonStub,
        saveStub: sinon.SinonStub,
        findByIdAndUpdateStub: sinon.SinonStub,
        findByIdAndDeleteStub: sinon.SinonStub;

    beforeEach(() => {
        userRepository = new MongoUserRepository();
        findStub = sinon.stub(UserModel, 'find');
        findByIdStub = sinon.stub(UserModel, 'findById');
        findOneStub = sinon.stub(UserModel, 'findOne');
        saveStub = sinon.stub(UserModel.prototype, 'save');
        findByIdAndUpdateStub = sinon.stub(UserModel, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(UserModel, 'findByIdAndDelete');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('findAll should retrieve all users', async () => {
        const mockUsers = [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
        ];
        findStub.resolves(mockUsers);

        const users = await userRepository.findAll();

        expect(findStub.calledOnce).to.be.true;
        expect(users).to.deep.equal(mockUsers);
    });

    it('findById should retrieve a user by ID', async () => {
        const mockUser = { id: '1', name: 'Alice' };
        findByIdStub.resolves(mockUser);

        const user = await userRepository.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(user).to.deep.equal(mockUser);
    });

    it('findByAccount should retrieve a user by account name', async () => {
        const mockUser = { account: 'alice', name: 'Alice' };
        findOneStub.resolves(mockUser);

        const user = await userRepository.findByAccount('alice');

        expect(findOneStub.calledWith({ account: 'alice' })).to.be.true;
        expect(user).to.deep.equal(mockUser);
    });

    it('findByAccount should return null if the user is not found', async () => {
        findOneStub.withArgs({ account: 'nonexistent' }).resolves(null);

        const user = await userRepository.findByAccount('nonexistent');

        expect(findOneStub.calledWith({ account: 'nonexistent' })).to.be.true;
        expect(user).to.be.null;
    });

    it('create should save a new user', async () => {
        const mockUser = { id: '1' };
        saveStub.resolves(mockUser);

        const user = await userRepository.create({
            account: 'alice',
            username: 'Alice',
            password: 'password',
            email: 'email@example.com',
            phone: '1234567890',
            role: 'shop',
            birthday: '2020-01-01',
        });

        expect(saveStub.calledOnce).to.be.true;
        expect(user).to.deep.equal({ id: mockUser.id });
    });

    it('updateById should update a user by ID', async () => {
        findByIdAndUpdateStub.resolves(true);

        const result = await userRepository.updateById('1', {
            phone: '0912345678',
        });

        expect(findByIdAndUpdateStub.calledWith('1', sinon.match.any)).to.be
            .true;
        expect(result).to.be.true;
    });

    it('deleteById should delete a user by ID', async () => {
        findByIdAndDeleteStub.resolves(true);

        const result = await userRepository.deleteById('1');

        expect(findByIdAndDeleteStub.calledWith('1')).to.be.true;
        expect(result).to.be.true;
    });
});
