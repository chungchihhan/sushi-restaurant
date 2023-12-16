import type { GetOrderResponse, GetOrdersResponse } from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { getOrder, getOrders } from '../../controllers/order';
import { MongoOrderRepository } from '../../controllers/order_repository';

describe('Order Controller', () => {
    describe('getOrders', () => {
        let orderRepoFindByUserIdMonthStub: sinon.SinonStub,
            orderRepoFindAllStub: sinon.SinonStub,
            req: Request,
            res: Response<GetOrdersResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetOrdersResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByUserIdMonthStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findByUserIdMonth',
            );
            orderRepoFindAllStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return all orders when no year and month provided', async () => {
            const mockOrders = [{ id: '1', user_id: 'user1' }];
            orderRepoFindAllStub.resolves(mockOrders);
            req = { body: {} } as Request;

            await getOrders(req, res);

            expect(orderRepoFindAllStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrders)).to.be.true;
        });

        it('should return orders of a user for a specific month and year', async () => {
            const mockOrders = [{ id: '2', user_id: 'user1' }];
            orderRepoFindByUserIdMonthStub.resolves(mockOrders);
            req = {
                body: { user_id: 'user1', year: '2021', month: '05' },
            } as Request;

            await getOrders(req, res);

            expect(orderRepoFindByUserIdMonthStub.calledWith('user1', 2021, 5))
                .to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrders)).to.be.true;
        });

        it('should return 404 if no orders found', async () => {
            orderRepoFindAllStub.resolves(null);
            req = { body: {} } as Request;

            await getOrders(req, res);

            expect(orderRepoFindAllStub.calledOnce).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Orders not found' })).to.be
                .true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            orderRepoFindAllStub.throws(error);
            req = { body: {} } as Request;

            await getOrders(req, res);
        });
    });

    describe('getOrder', () => {
        let orderRepoFindByIdStub: sinon.SinonStub,
            req: Request<{ id: string }>,
            res: Response<GetOrderResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetOrderResponse | { error: string }>;
            statusStub.returns(res);

            orderRepoFindByIdStub = sinon.stub(
                MongoOrderRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return a specific order', async () => {
            const mockOrder = { id: '1', user_id: 'user1' };
            orderRepoFindByIdStub.withArgs('1').resolves(mockOrder);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith('1')).to.be.true;
            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockOrder)).to.be.true;
        });

        it('should return 404 if the order is not found', async () => {
            orderRepoFindByIdStub.withArgs('1').resolves(null);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);

            expect(orderRepoFindByIdStub.calledWith('1')).to.be.true;
            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Order not found' })).to.be.true;
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            orderRepoFindByIdStub.withArgs('1').throws(error);
            req = { params: { id: '1' } } as Request<{ id: string }>;

            await getOrder(req, res);
        });
    });
});
