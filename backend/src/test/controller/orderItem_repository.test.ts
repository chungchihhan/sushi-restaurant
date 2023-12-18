import { expect } from 'chai';
import sinon from 'sinon';

import { MongoOrderItemRepository } from '../../controllers/orderItem_repository';
import OrderItemModel from '../../models/orderItem';

describe('MongoOrderItemRepository', () => {
    let orderItemRepository: MongoOrderItemRepository,
        findStub: sinon.SinonStub,
        findByIdStub: sinon.SinonStub,
        saveStub: sinon.SinonStub,
        findByIdAndUpdateStub: sinon.SinonStub,
        findByIdAndDeleteStub: sinon.SinonStub;

    beforeEach(() => {
        orderItemRepository = new MongoOrderItemRepository();
        findStub = sinon.stub(OrderItemModel, 'find');
        findByIdStub = sinon.stub(OrderItemModel, 'findById');
        saveStub = sinon.stub(OrderItemModel.prototype, 'save');
        findByIdAndUpdateStub = sinon.stub(OrderItemModel, 'findByIdAndUpdate');
        findByIdAndDeleteStub = sinon.stub(OrderItemModel, 'findByIdAndDelete');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('findAll should retrieve all orderItems', async () => {
        const mockOrderItems = [
            {
                id: '1',
                order_id: 'O1',
                meal_id: 'M1',
                quantity: 1,
                remark: 'R1',
            },
            {
                id: '2',
                order_id: 'O2',
                meal_id: 'M2',
                quantity: 2,
                remark: 'R2',
            },
        ];
        findStub.resolves(mockOrderItems);

        const orderItems = await orderItemRepository.findAll();

        expect(findStub.calledOnce).to.be.true;
        expect(orderItems).to.deep.equal(mockOrderItems);
    });

    it('findById should retrieve a orderItem by ID', async () => {
        const mockOrderItem = [
            {
                id: '1',
                order_id: 'O1',
                meal_id: 'M1',
                quantity: 1,
                remark: 'R1',
            },
        ];
        findByIdStub.resolves(mockOrderItem);

        const orderItem = await orderItemRepository.findById('1');

        expect(findByIdStub.calledWith('1')).to.be.true;
        expect(orderItem).to.deep.equal(mockOrderItem);
    });

    it('findByOrderId should retrieve a orderItem by Order Id', async () => {
        const mockOrderItem = [
            {
                id: '1',
                order_id: 'O1',
                meal_id: 'M1',
                quantity: 1,
                remark: 'R1',
            },
        ];
        findStub.withArgs({ order_id: 'O1' }).resolves(mockOrderItem);

        const orderItem = await orderItemRepository.findByOrderId('O1');

        expect(findStub.calledWith({ order_id: 'O1' })).to.be.true;
        expect(orderItem).to.deep.equal(mockOrderItem);
    });

    it('create should save a new OrderItem', async () => {
        const mockOrderItem = { id: '1' };
        saveStub.resolves(mockOrderItem);

        const orderItem = await orderItemRepository.create({
            order_id: 'O1',
            meal_id: 'M1',
            quantity: 1,
            remark: 'R1',
        });

        expect(saveStub.calledOnce).to.be.true;
        expect(orderItem).to.deep.equal({ id: mockOrderItem.id });
    });

    it('updateById should update a OrderItem by ID', async () => {
        findByIdAndUpdateStub.resolves(true);

        const result = await orderItemRepository.updateById('1', {
            quantity: 2,
        });

        expect(findByIdAndUpdateStub.calledWith('1', sinon.match.any)).to.be
            .true;
        expect(result).to.be.true;
    });

    it('deleteById should delete a OrderItem by ID', async () => {
        findByIdAndDeleteStub.resolves(true);

        const result = await orderItemRepository.deleteById('1');

        expect(findByIdAndDeleteStub.calledWith('1')).to.be.true;
        expect(result).to.be.true;
    });
});
