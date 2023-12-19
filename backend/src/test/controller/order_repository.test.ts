import { expect } from 'chai';
import nodemailer from 'nodemailer';
import nodemailerMock from 'nodemailer-mock';
import sinon from 'sinon';

import { OrderStatus } from '../../../../lib/shared_types';
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
        mealRepoFindByIdStub: sinon.SinonStub,
        createTransportStub: sinon.SinonStub;

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
        createTransportStub = sinon
            .stub(nodemailer, 'createTransport')
            .returns(nodemailerMock.createTransport());
        process.env.GMAIL = 'test@example.com';
        process.env.GMAIL_PASS = 'testpass';
    });

    afterEach(() => {
        sinon.restore();
        nodemailerMock.mock.reset();
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
            status: 'finished',
        };
        findByIdStub.withArgs(orderId).resolves(mockOrder);

        const mockShop = { id: 'shop123', name: 'Test Shop' };
        shopRepoFindByIdStub.withArgs(mockOrder.shop_id).resolves(mockShop);

        const mockOrderItems = [
            {
                order_id: orderId,
                meal_id: 'meal123',
                quantity: 2,
                remark: 'No onions',
            },
        ];
        orderItemModelFindStub
            .withArgs({ order_id: orderId })
            .resolves(mockOrderItems);

        const mockMeal = { id: 'meal123', name: 'Test Meal', price: 10 };
        mealRepoFindByIdStub
            .withArgs(mockOrderItems[0].meal_id)
            .resolves(mockMeal);

        const expectedTotalPrice = mockOrderItems[0].quantity * mockMeal.price;
        const expectedOrderDetails = {
            id: mockOrder.id,
            user_id: mockOrder.user_id,
            status: mockOrder.status,
            date: mockOrder.order_date.toISOString(),
            order_items: [
                {
                    meal_name: mockMeal.name,
                    quantity: mockOrderItems[0].quantity,
                    meal_price: mockMeal.price,
                    remark: mockOrderItems[0].remark,
                },
            ],
            shop_name: mockShop.name,
            shop_id: mockShop.id,
            total_price: expectedTotalPrice,
        };

        const orderDetails = await orderRepo.findDetailsByOrderId(orderId);

        expect(findByIdStub.calledWith(orderId)).to.be.true;
        expect(shopRepoFindByIdStub.calledWith(mockOrder.shop_id)).to.be.true;
        expect(orderItemModelFindStub.calledWith({ order_id: orderId })).to.be
            .true;
        expect(mealRepoFindByIdStub.calledWith(mockOrderItems[0].meal_id)).to.be
            .true;
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
        expect(orderItemModelFindStub.calledWith({ order_id: orderId })).to.be
            .true;
        expect(mealRepoFindByIdStub.calledWith(mockOrderItems[0].meal_id)).to.be
            .true;
        expect(orderDetails).to.be.null;
    });

    it('findDetailsByOrderId should return null in case of an exception', async () => {
        const orderId = 'order123';
        const error = new Error('Test error');

        findByIdStub.withArgs(orderId).throws(error);

        const result = await orderRepo.findDetailsByOrderId(orderId);

        expect(result).to.be.null;
    });

    it('sendEmailToUser should not send an email when env GMAIL is not set', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.INPROGRESS,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        // Save original values
        const originalGmail = process.env.GMAIL;

        // Unset environment variables
        delete process.env.GMAIL;

        // Call the function
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.INPROGRESS;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        // Assert that the email was not sent
        expect(nodemailerMock.mock.getSentMail().length).to.equal(0);
        expect(result).to.be.false;

        // Reset environment variables
        process.env.GMAIL = originalGmail;
    });

    it('sendEmailToUser should not send an email when env GMAIL_PASS is not set', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.INPROGRESS,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        // Save original values
        const originalGmailPass = process.env.GMAIL_PASS;

        // Unset environment variables
        delete process.env.GMAIL_PASS;

        // Call the function
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.INPROGRESS;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        // Assert that the email was not sent
        expect(nodemailerMock.mock.getSentMail().length).to.equal(0);
        expect(result).to.be.false;

        // Reset environment variables
        process.env.GMAIL_PASS = originalGmailPass;
    });

    it('sendEmailToUser should send an email for "inprogress" order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.INPROGRESS,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.INPROGRESS;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(1);
        expect(sentEmails[0].to).to.equal(userEmail);
        expect(sentEmails[0].subject).to.include('你的訂單已成功訂購');
        expect(result).to.be.true;
    });

    it('sendEmailToUser should send an email for "ready" order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.READY,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.READY;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(1);
        expect(sentEmails[0].to).to.equal(userEmail);
        expect(sentEmails[0].subject).to.include('你的訂單已準備完成');
        expect(result).to.be.true;
    });

    it('sendEmailToUser should send an email for "cancelled" order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.CANCELLED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.CANCELLED;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(1);
        expect(sentEmails[0].to).to.equal(userEmail);
        expect(sentEmails[0].subject).to.include('你的訂單已被取消');
        expect(result).to.be.true;
    });

    it('sendEmailToUser should return false for other order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.FINISHED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.FINISHED;

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(0);
        expect(result).to.be.false;
    });

    it('sendEmailToUser should return false and log an error when sending email fails', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.FINISHED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.FINISHED;
        const consoleErrorStub = sinon.stub(console, 'error');

        const error = new Error('Test error');

        createTransportStub.throws(error);

        const result = await orderRepo.sendEmailToUser(
            orderDetails,
            userEmail,
            orderStatus,
        );

        expect(result).to.be.false;
        expect(consoleErrorStub.calledWith('Error sending email:')).to.be.true;
        consoleErrorStub.restore();
    });

    it('sendEmailToShop should not send an email when env GMAIL is not set', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.INPROGRESS,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        // Save original values
        const originalGmail = process.env.GMAIL;

        // Unset environment variables
        delete process.env.GMAIL;

        // Call the function
        const shopmail = 'shop@example.com';
        const orderStatus = OrderStatus.INPROGRESS;

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            shopmail,
            orderStatus,
        );

        // Assert that the email was not sent
        expect(nodemailerMock.mock.getSentMail().length).to.equal(0);
        expect(result).to.be.false;

        // Reset environment variables
        process.env.GMAIL = originalGmail;
    });

    it('sendEmailToShop should not send an email when env GMAIL_PASS is not set', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.INPROGRESS,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        // Save original values
        const originalGmailPass = process.env.GMAIL_PASS;

        // Unset environment variables
        delete process.env.GMAIL_PASS;

        // Call the function
        const shopmail = 'user@example.com';
        const orderStatus = OrderStatus.INPROGRESS;

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            shopmail,
            orderStatus,
        );

        // Assert that the email was not sent
        expect(nodemailerMock.mock.getSentMail().length).to.equal(0);
        expect(result).to.be.false;

        // Reset environment variables
        process.env.GMAIL_PASS = originalGmailPass;
    });

    it('sendEmailToShop should send an email for "waiting" order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.WAITING,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.WAITING;

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(1);
        expect(sentEmails[0].to).to.equal(userEmail);
        expect(sentEmails[0].subject).to.include('有新的訂單等待確認');
        expect(result).to.be.true;
    });

    it('sendEmailToShop should send an email for "cancelled" order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.CANCELLED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.CANCELLED;

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(1);
        expect(sentEmails[0].to).to.equal(userEmail);
        expect(sentEmails[0].subject).to.include('有一筆訂單已被取消');
        expect(result).to.be.true;
    });

    it('sendEmailToShop should return false for other order status', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.FINISHED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.FINISHED;

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            userEmail,
            orderStatus,
        );

        const sentEmails = nodemailerMock.mock.getSentMail();

        expect(sentEmails.length).to.equal(0);
        expect(result).to.be.false;
    });

    it('sendEmailToShop should return false and log an error when sending email fails', async () => {
        const orderDetails = {
            id: 'O1',
            user_id: 'U1',
            status: OrderStatus.FINISHED,
            date: '2023-12-01',
            order_items: [
                {
                    meal_name: 'Test Meal 1',
                    quantity: 1,
                    meal_price: 100,
                    remark: 'no',
                },
            ],
            shop_name: 'Test Shop 1',
            shop_id: 'S1',
            total_price: 100,
        };
        const userEmail = 'user@example.com';
        const orderStatus = OrderStatus.FINISHED;
        const consoleErrorStub = sinon.stub(console, 'error');

        const error = new Error('Test error');

        createTransportStub.throws(error);

        const result = await orderRepo.sendEmailToShop(
            orderDetails,
            userEmail,
            orderStatus,
        );

        expect(result).to.be.false;
        expect(consoleErrorStub.calledWith('Error sending email:')).to.be.true;
        consoleErrorStub.restore();
    });
});
