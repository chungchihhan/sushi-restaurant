import { expect } from 'chai';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import MealModel from '../../models/meal';
import redis from '../../utils/redis';

describe('MongoMealRepository', () => {
    let mealRepository: MongoMealRepository,
        findStub: sinon.SinonStub,
        saveStub: sinon.SinonStub;

    beforeEach(() => {
        mealRepository = new MongoMealRepository();
        findStub = sinon.stub(MealModel, 'find');
        saveStub = sinon.stub(MealModel.prototype, 'save');
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
});

// The test would not terminate if we don't quit the redis client.
redis?.quit();
