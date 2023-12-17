import { expect } from 'chai';
import sinon from 'sinon';

import { MongoShopRepository } from '../../controllers/shop_repository';
import ShopModel from '../../models/shop';

describe('MongoShopRepository', () => {
    let shopRepository: MongoShopRepository,
        findStub: sinon.SinonStub,
        findByIdStub: sinon.SinonStub,
        saveStub: sinon.SinonStub,
        findByIdAndUpdateStub: sinon.SinonStub,
        findByIdAndDeleteStub: sinon.SinonStub,
        existsStub: sinon.SinonStub;

    beforeEach(() => {
        shopRepository = new MongoShopRepository();
        findStub = sinon.stub(ShopModel, 'find');
        findByIdStub = sinon.stub(ShopModel, 'findById');
        saveStub = sinon.stub(ShopModel.prototype, 'save');
        findByIdAndUpdateStub = sinon.stub(ShopModel, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(ShopModel, 'findByIdAndDelete');
        existsStub = sinon.stub(ShopModel, 'exists');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('findAll should retrieve all shops', async () => {
        const mockShops = [
            { id: '1', user_id: 'userId1', name: 'shop A' },
            { id: '2', user_id: 'userId2', name: 'shop B' },
        ];
        findStub.resolves(mockShops);

        const shops = await shopRepository.findAll();

        expect(findStub.calledOnce).to.be.true;
        expect(shops).to.deep.equal(mockShops);
    });

    it('findAllByCategory should retrieve shops of a specific category', async () => {
        const mockShops = [{ id: '1', name: 'Shop A', category: 'Food' }];
        findStub.withArgs({ category: 'Food' }).resolves(mockShops);

        const shops = await shopRepository.findAllByCategory('Food');

        expect(findStub.calledWith({ category: 'Food' })).to.be.true;
        expect(shops).to.deep.equal(mockShops);
    });

    it('findAllByCategory should return null if no shops are found', async () => {
        findStub.withArgs({ category: 'Nonexistent' }).resolves([]);

        const shops = await shopRepository.findAllByCategory('Nonexistent');

        expect(findStub.calledWith({ category: 'Nonexistent' })).to.be.true;
        expect(shops).to.deep.equal([]);
    });

    it('findById should retrieve a shop by ID', async () => {
        const mockShop = { id: '1', name: 'Shop A' };
        findByIdStub.resolves(mockShop);

        const shop = await shopRepository.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(shop).to.deep.equal(mockShop);
    });

    it('findByUserId should retrieve shops of a specific user', async () => {
        const mockShops = [{ id: '1', name: 'Shop A', user_id: 'user123' }];
        findStub.withArgs({ user_id: 'user123' }).resolves(mockShops);

        const shops = await shopRepository.findByUserId('user123');

        expect(findStub.calledWith({ user_id: 'user123' })).to.be.true;
        expect(shops).to.deep.equal(mockShops);
    });

    it('findByUserId should return null if no shops are found', async () => {
        findStub.withArgs({ user_id: 'nonexistentUser' }).resolves([]);

        const shops = await shopRepository.findByUserId('nonexistentUser');

        expect(findStub.calledWith({ user_id: 'nonexistentUser' })).to.be.true;
        expect(shops).to.deep.equal([]);
    });

    it('existsByName should return true if a shop with the given name exists', async () => {
        existsStub.withArgs({ name: 'Existing Shop' }).resolves(true);

        const exists = await shopRepository.existsByName('Existing Shop');

        expect(existsStub.calledWith({ name: 'Existing Shop' })).to.be.true;
        expect(exists).to.be.true;
    });

    it('existsByName should return false if no shop with the given name exists', async () => {
        existsStub.withArgs({ name: 'Nonexistent Shop' }).resolves(false);

        const exists = await shopRepository.existsByName('Nonexistent Shop');

        expect(existsStub.calledWith({ name: 'Nonexistent Shop' })).to.be.true;
        expect(exists).to.be.false;
    });

    it('create should save a new shop', async () => {
        const mockShop = { id: '1', name: 'New Shop' };
        saveStub.resolves(mockShop);

        const shop = await shopRepository.create({
            user_id: 'userId1',
            name: 'New Shop',
            address: 'Taipei',
            phone: '0912345678',
            image: 'xxx',
            category: '美式',
            monday: '9-19',
            tuesday: '9-19',
            wednesday: '9-19',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: '',
        });

        expect(saveStub.calledOnce).to.be.true;
        expect(shop).to.deep.equal({ id: mockShop.id });
    });

    it('updateById should update a shop by ID', async () => {
        findByIdAndUpdateStub.resolves({ id: '1' });

        const result = await shopRepository.updateById('1', {
            name: 'Updated Shop',
        });

        expect(findByIdAndUpdateStub.calledWith('1', sinon.match.any)).to.be
            .true;
        expect(result).to.be.true;
    });

    it('deleteById should delete a shop by ID', async () => {
        findByIdAndDeleteStub.resolves({ id: '1' });

        const result = await shopRepository.deleteById('1');

        expect(findByIdAndDeleteStub.calledWith('1')).to.be.true;
        expect(result).to.be.true;
    });
});
