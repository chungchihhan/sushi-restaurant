import { expect } from 'chai';
import nodemailer from 'nodemailer';
import sinon from 'sinon';

import { MongoMealRepository } from '../../controllers/meal_repository';
import { MongoOrderRepository } from '../../controllers/order_repository';
import { MongoShopRepository } from '../../controllers/shop_repository';
import OrderModel from '../../models/order';
import OrderItemModel from '../../models/orderItem';

describe('MongoOrderRepository', () => {
    let orderRepo: MongoOrderRepository,
        findStub: sinon.SinonStub,
        findByIdStub: sinon.SinonStub,
        saveStub: sinon.SinonStub,
        findByIdAndUpdateStub: sinon.SinonStub,
        findByIdAndDeleteStub: sinon.SinonStub,
        orderItemModelFindStub: sinon.SinonStub,
        shopRepoFindByIdStub: sinon.SinonStub,
        mealRepoFindByIdStub: sinon.SinonStub;

    beforeEach(() => {
        orderRepo = new MongoOrderRepository();
        findStub = sinon.stub(OrderModel, 'find');
        findByIdStub = sinon.stub(OrderModel, 'findById');
        saveStub = sinon.stub(OrderModel.prototype, 'save');
        findByIdAndUpdateStub = sinon.stub(OrderModel, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(OrderModel, 'findByIdAndDelete');
        orderItemModelFindStub = sinon.stub(OrderItemModel, 'find');
        shopRepoFindByIdStub = sinon.stub(
            MongoShopRepository.prototype,
            'findById',
        );
        mealRepoFindByIdStub = sinon.stub(
            MongoMealRepository.prototype,
            'findById',
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('findAll should retrieve all orders', async () => {
        const mockOrders = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
            {
                id: '2',
                user_id: 'U2',
                shop_id: 'S2',
                order_items: [],
                order_date: '2023-12-02',
                status: 'inprogress',
            },
        ];
        findStub.resolves(mockOrders);

        const orders = await orderRepo.findAll();

        expect(findStub.calledOnce).to.be.true;
        expect(orders).to.deep.equal(mockOrders);
    });

    it('findById should retrieve a specific order', async () => {
        const mockOrder = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
        ];
        findByIdStub.withArgs('1').resolves(mockOrder);

        const order = await orderRepo.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(order).to.deep.equal(mockOrder);
    });

    it('findByUserId should retrieve orders for a specific user', async () => {
        const mockOrder = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
        ];
        findStub.withArgs({ user_id: 'U1' }).resolves(mockOrder);

        const orders = await orderRepo.findByUserId('U1');

        expect(findStub.calledWith({ user_id: 'U1' })).to.be.true;
        expect(orders).to.deep.equal(mockOrder);
    });

    it('findByShopId should retrieve orders for a specific shop', async () => {
        const mockOrder = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
        ];
        findStub.withArgs({ shop_id: 'S1' }).resolves(mockOrder);

        const orders = await orderRepo.findByShopId('S1');

        expect(findStub.calledWith({ shop_id: 'S1' })).to.be.true;
        expect(orders).to.deep.equal(mockOrder);
    });

    it('findByUserIdMonth should retrieve orders for a user in a specific month', async () => {
        const userId = 'U1';
        const year = 2023;
        const month = 12;
        const mockOrders = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
        ];

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        findStub
            .withArgs({
                user_id: userId,
                order_date: { $gte: startDate, $lte: endDate },
            })
            .resolves(mockOrders);

        const orders = await orderRepo.findByUserIdMonth(userId, year, month);

        expect(
            findStub.calledWith({
                user_id: userId,
                order_date: { $gte: startDate, $lte: endDate },
            }),
        ).to.be.true;
        expect(orders).to.deep.equal(mockOrders);
    });

    it('create should successfully create a new order and return its ID', async () => {
        const mockPayload = {
            user_id: 'U1',
            shop_id: 'S1',
            order_items: [],
            order_date: '2023-12-01',
            status: 'waiting',
        };

        const mockResponse = {
            id: '1',
        };

        saveStub.resolves(mockResponse);

        const result = await orderRepo.create(mockPayload);

        expect(saveStub.calledOnce).to.be.true;
        expect(result).to.deep.equal({ id: mockResponse.id });
    });

    it('findByShopIdMonth should retrieve orders for a shop in a specific month', async () => {
        const shopId = 'S1';
        const year = 2023;
        const month = 12;
        const mockOrders = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'waiting',
            },
        ];

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        findStub
            .withArgs({
                shop_id: shopId,
                order_date: { $gte: startDate, $lte: endDate },
            })
            .resolves(mockOrders);

        const orders = await orderRepo.findByShopIdMonth(shopId, year, month);

        expect(
            findStub.calledWith({
                shop_id: shopId,
                order_date: { $gte: startDate, $lte: endDate },
            }),
        ).to.be.true;
        expect(orders).to.deep.equal(mockOrders);
    });

    it('updateById should update an existing order and return true', async () => {
        const orderId = '1';
        const updatePayload = {
            status: 'finished',
        };
        const mockOrder = [
            {
                id: '1',
                user_id: 'U1',
                shop_id: 'S1',
                order_items: [],
                order_date: '2023-12-01',
                status: 'finished',
            },
        ];

        findByIdAndUpdateStub
            .withArgs(orderId, updatePayload, { new: true })
            .resolves(mockOrder);

        const result = await orderRepo.updateById(orderId, updatePayload);

        expect(
            findByIdAndUpdateStub.calledWith(orderId, updatePayload, {
                new: true,
            }),
        ).to.be.true;
        expect(result).to.be.true;
    });

    it('deleteById should return false if the order does not exist', async () => {
        const orderId = 'nonExistingOrder';

        findByIdAndDeleteStub.withArgs(orderId).resolves(null);

        const result = await orderRepo.deleteById(orderId);

        expect(findByIdAndDeleteStub.calledWith(orderId)).to.be.true;
        expect(result).to.be.false;
    });

    it('findDetailsByOrderId should retrieve detailed order information', async () => {
        const orderId = 'order123';
        const mockOrder = {
            id: orderId,
            user_id: 'user123',
            shop_id: 'shop123',
            order_items: [],
            order_date: new Date('2023-12-01'),
            status: 'finished'
        };
        findByIdStub.withArgs(orderId).resolves(mockOrder);

        const mockShop = { id: 'shop123', name: 'Test Shop' };
        shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);

        const mockOrderItems = [{ order_id: orderId, meal_id: 'meal123', quantity: 2, remark: 'No onions' }];
        orderItemModelFindStub.withArgs({ order_id: orderId }).resolves(mockOrderItems);

        const mockMeal = { id: 'meal123', name: 'Test Meal', price: 10 };
        mealRepoFindByIdStub.withArgs(mockOrderItems[0].meal_id).resolves(mockMeal);

        const expectedTotalPrice = mockOrderItems[0].quantity * mockMeal.price;
        const expectedOrderDetails = {
            id: mockOrder.id,
            user_id: mockOrder.user_id,
            status: mockOrder.status,
            date: (mockOrder.order_date).toISOString(),
            order_items: [{
                meal_name: mockMeal.name,
                quantity: mockOrderItems[0].quantity,
                meal_price: mockMeal.price,
                remark: mockOrderItems[0].remark,
            }],
            shop_name: mockShop.name,
            shop_id: mockShop.id,
            total_price: expectedTotalPrice,
        };

        const orderDetails = await orderRepo.findDetailsByOrderId(orderId);

        expect(findByIdStub.calledWith(orderId)).to.be.true;
        expect(shopRepoFindByIdStub.calledWith(mockOrder.shop_id)).to.be.true;
        expect(orderItemModelFindStub.calledWith({ order_id: orderId })).to.be.true;
        expect(mealRepoFindByIdStub.calledWith(mockOrderItems[0].meal_id)).to.be.true;
        expect(orderDetails).to.deep.equal(expectedOrderDetails);
    });

    it('findDetailsByOrderId should return null if order is not found', async () => {
        const orderId = 'nonExistingOrder';
        findByIdStub.withArgs(orderId).resolves(null);

        const orderDetails = await orderRepo.findDetailsByOrderId(orderId);

        expect(findByIdStub.calledWith(orderId)).to.be.true;
        expect(orderDetails).to.be.null;
    });

    it('findDetailsByOrderId should return null if shop is not found', async () => {
        const orderId = 'order123';
        const mockOrder = { id: orderId, shop_id: 'shop123' };
        findByIdStub.withArgs(orderId).resolves(mockOrder);

        shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(null);

        const orderDetails = await orderRepo.findDetailsByOrderId(orderId);

        expect(findByIdStub.calledWith(orderId)).to.be.true;
        expect(shopRepoFindByIdStub.calledWith(mockOrder.shop_id)).to.be.true;
        expect(orderDetails).to.be.null;
    });

    it('findDetailsByOrderId should return null if a meal is not found', async () => {
        const orderId = 'order123';
        const mockOrder = {
            id: orderId,
            shop_id: 'shop123',
            order_date: new Date(),
            status: 'completed',
        };
        findByIdStub.withArgs(orderId).resolves(mockOrder);

        const mockShop = { id: 'shop123', name: 'Test Shop' };
        shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);

        const mockOrderItems = [
            {
                order_id: orderId,
                meal_id: 'nonExistingMeal',
                quantity: 2,
                remark: 'No onions',
            },
        ];
        orderItemModelFindStub
            .withArgs({ order_id: orderId })
            .resolves(mockOrderItems);

        mealRepoFindByIdStub.withArgs(mockOrderItems[0].meal_id).resolves(null); // Ensure meal is not found

        const orderDetails = await orderRepo.findDetailsByOrderId(orderId);
        
        expect(findByIdStub.calledWith(orderId)).to.be.true;
        expect(shopRepoFindByIdStub.calledWith(mockOrder.shop_id)).to.be.true;
        expect(orderItemModelFindStub.calledWith({ order_id: orderId })).to.be.true;
        expect(mealRepoFindByIdStub.calledWith(mockOrderItems[0].meal_id)).to.be.true;
        expect(orderDetails).to.be.null;
    });
    
    it('findDetailsByOrderId should return null in case of an exception', async () => {
        const orderId = 'order123';
        const error = new Error('Test error');
    
        findByIdStub.withArgs(orderId).throws(error);
    
        const result = await orderRepo.findDetailsByOrderId(orderId);
    
        expect(result).to.be.null;
    });
});
