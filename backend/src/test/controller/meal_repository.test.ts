import { expect } from 'chai';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import MealModel from '../../models/meal';
import redis from '../../utils/redis';

describe('MongoMealRepository', () => {
    let mealRepository: MongoMealRepository,
        findStub: sinon.SinonStub,
        saveStub: sinon.SinonStub,
        findByIdStub: sinon.SinonStub,
        existsStub: sinon.SinonStub,
        findByIdAndUpdateStub: sinon.SinonStub,
        redisGetStub: sinon.SinonStub,
        redisSetStub: sinon.SinonStub;

    beforeEach(() => {
        mealRepository = new MongoMealRepository();
        findStub = sinon.stub(MealModel, 'find');
        saveStub = sinon.stub(MealModel.prototype, 'save');
        findByIdStub = sinon.stub(MealModel, 'findById');
        existsStub = sinon.stub(MealModel, 'exists');
        findByIdAndUpdateStub = sinon.stub(MealModel, 'findByIdAndUpdate');
        redisGetStub = sinon.stub(redis as any, 'get');
        redisSetStub = sinon.stub(redis as any, 'set');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('findAll should retrieve all meals', async () => {
        const mockMeals = [
            {
                id: '1',
                shop_id: 'S1',
                name: 'N1',
                description: 'none',
                price: 100,
                quantity: 50,
                category: '中式',
                image: 'none',
                active: true,
            },
            {
                id: '2',
                shop_id: 'S1',
                name: 'N2',
                description: 'none',
                price: 200,
                quantity: 100,
                category: '美式',
                image: 'none',
                active: true,
            },
        ];
        findStub.resolves(mockMeals);

        const meals = await mealRepository.findAll();

        expect(findStub.calledOnce).to.be.true;
        expect(meals).to.deep.equal(mockMeals);
    });

    it('findAllbyShopId should retrieve meals by Shop Id', async () => {
        const mockMeals = [
            {
                id: '1',
                shop_id: 'S1',
                name: 'N1',
                description: 'none',
                price: 100,
                quantity: 50,
                category: '中式',
                image: 'none',
                active: true,
            },
            {
                id: '2',
                shop_id: 'S1',
                name: 'N2',
                description: 'none',
                price: 200,
                quantity: 100,
                category: '美式',
                image: 'none',
                active: true,
            },
        ];
        findStub.withArgs({ shop_id: 'S1' }).resolves(mockMeals);

        const meals = await mealRepository.findAllbyShopId('S1');

        expect(findStub.calledWith({ shop_id: 'S1' })).to.be.true;
        expect(meals).to.deep.equal(mockMeals);
    });

    it('findById should retrieve a meal by ID from the database', async () => {
        const mockMeal = {
            _id: '1',
            shop_id: 'S1',
            name: 'N1',
            description: 'none',
            price: 100,
            quantity: 50,
            category: '中式',
            image: 'none',
            active: true,
        };
        findByIdStub.withArgs('1').resolves(mockMeal);

        const mealResponse = await mealRepository.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(mealResponse).to.deep.equal({
            id: '1',
            shop_id: 'S1',
            name: 'N1',
            description: 'none',
            price: 100,
            quantity: 50,
            category: '中式',
            image: 'none',
            active: true,
        });
    });

    it('findById should return null if meal does not exist', async () => {
        const mockMeal = null;
        findByIdStub.withArgs('1').resolves(mockMeal);

        const mealResponse = await mealRepository.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(mealResponse).to.deep.equal(null);
    });

    it('findById should return cached meal from Redis', async () => {
        const mockMeal = {
            _id: '1',
            shop_id: 'S1',
            name: 'N1',
            description: 'none',
            price: 100,
            quantity: 50,
            category: '中式',
            image: 'none',
            active: true,
        };
        redisGetStub.resolves(JSON.stringify(mockMeal));

        const result = await mealRepository.findById('1');
        console.log(result);

        expect(result).to.eql(mockMeal);
        sinon.assert.calledOnce(redisGetStub);
        sinon.assert.notCalled(findByIdStub);
    });

    it('findById should fetch meal from DB and cache it if not in Redis', async () => {
        redisGetStub.resolves(null);
        const dbMeal = {
            _id: '1',
            shop_id: 'S1',
            name: 'N1',
            description: 'none',
            price: 100,
            quantity: 50,
            category: '中式',
            image: 'none',
            active: true,
        };
        findByIdStub.resolves(dbMeal);

        const result = await mealRepository.findById('1');

        // `_id` would become `id`
        expect(result).to.include({ id: '1', name: 'N1' });
        sinon.assert.calledOnce(redisGetStub);
        sinon.assert.calledOnce(findByIdStub);
        sinon.assert.calledOnce(redisSetStub);
    });

    it('findById should return null if meal not found in Redis or DB', async () => {
        redisGetStub.resolves(null);
        findByIdStub.resolves(null);

        const result = await mealRepository.findById('1');

        expect(result).to.be.null;
        sinon.assert.calledOnce(redisGetStub);
        sinon.assert.calledOnce(findByIdStub);
    });

    it('findByName should retrieve meals by name', async () => {
        const mockMeals = [
            {
                id: '1',
                shop_id: 'S1',
                name: 'Meal Name',
                description: 'none',
                price: 100,
                quantity: 50,
                category: '中式',
                image: 'none',
                active: true,
            },
            {
                id: '2',
                shop_id: 'S1',
                name: 'Meal Name',
                description: 'none',
                price: 200,
                quantity: 100,
                category: '美式',
                image: 'none',
                active: true,
            },
        ];
        findStub.withArgs({ name: 'Meal Name' }).resolves(mockMeals);

        const meals = await mealRepository.findByName('Meal Name');

        expect(findStub.calledWith({ name: 'Meal Name' })).to.be.true;
        expect(meals).to.deep.equal(mockMeals);
    });

    it('existsByShopAndName should return true if a meal exists', async () => {
        const shop_id = 'shop123';
        const name = 'MealName';
        existsStub.withArgs({ shop_id, name }).resolves(true);

        const result = await mealRepository.existsByShopAndName(shop_id, name);

        expect(existsStub.calledWith({ shop_id, name })).to.be.true;
        expect(result).to.be.true;
    });

    it('existsByShopAndName should return false if a meal does not exist', async () => {
        const shop_id = 'shop123';
        const name = 'NonExistentMeal';
        existsStub.withArgs({ shop_id, name }).resolves(false);

        const result = await mealRepository.existsByShopAndName(shop_id, name);

        expect(existsStub.calledWith({ shop_id, name })).to.be.true;
        expect(result).to.be.false;
    });

    it('create should save a new Meal', async () => {
        const mockMeal = { id: '1' };
        saveStub.resolves(mockMeal);

        const meal = await mealRepository.create({
            shop_id: 'S1',
            name: 'Meal Name',
            description: 'none',
            price: 100,
            quantity: 50,
            category: '中式',
            image: 'none',
            active: true,
        });

        expect(saveStub.calledOnce).to.be.true;
        expect(meal).to.deep.equal({ id: mockMeal.id });
    });

    it('updateById should return true on successful update', async () => {
        const id = 'meal123';
        const updatePayload = { name: 'UpdatedMealName' };
        const updatedMeal = { id, ...updatePayload };

        findByIdAndUpdateStub
            .withArgs(id, updatePayload, { new: true })
            .resolves(updatedMeal);

        const result = await mealRepository.updateById(id, updatePayload);

        expect(
            findByIdAndUpdateStub.calledWith(id, updatePayload, { new: true }),
        ).to.be.true;
        expect(result).to.be.true;
    });

    it('updateById should return false when update fails', async () => {
        const id = 'meal123';
        const updatePayload = { name: 'UpdatedMealName' };

        findByIdAndUpdateStub
            .withArgs(id, updatePayload, { new: true })
            .resolves(null);

        const result = await mealRepository.updateById(id, updatePayload);

        expect(
            findByIdAndUpdateStub.calledWith(id, updatePayload, { new: true }),
        ).to.be.true;
        expect(result).to.be.false;
    });

    it('deleteById should return true on successful deletion', async () => {
        const id = 'meal123';
        const mockDeactivatedMeal = { id, active: false };

        findByIdAndUpdateStub
            .withArgs(id, { active: false }, { new: true })
            .resolves(mockDeactivatedMeal);

        const result = await mealRepository.deleteById(id);

        expect(
            findByIdAndUpdateStub.calledWith(
                id,
                { active: false },
                { new: true },
            ),
        ).to.be.true;
        expect(result).to.be.true;
    });

    it('deleteById should return false when deletion fails', async () => {
        const id = 'meal123';

        findByIdAndUpdateStub
            .withArgs(id, { active: false }, { new: true })
            .resolves(null);

        const result = await mealRepository.deleteById(id);

        expect(
            findByIdAndUpdateStub.calledWith(
                id,
                { active: false },
                { new: true },
            ),
        ).to.be.true;
        expect(result).to.be.false;
    });
});
