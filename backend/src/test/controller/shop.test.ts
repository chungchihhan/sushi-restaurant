import type { GetShopResponse, GetShopsResponse } from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { getShop, getShops } from '../../controllers/shop';
import { MongoShopRepository } from '../../controllers/shop_repository';

describe('Shop Controller', () => {
    describe('getShops', () => {
        let res: Response<GetShopsResponse>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse>;
            statusStub.returns(res);

            shopRepoFindAllStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return all shops successfully', async () => {
            const mockShops = [
                { id: '1', name: 'Shop 1' },
                { id: '2', name: 'Shop 2' },
            ];

            shopRepoFindAllStub.resolves(mockShops);

            await getShops({} as Request, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShops)).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllStub.throws(new Error('Database error'));

            await getShops({} as Request, res);
        });
    });

    describe('getShop', () => {
        let req: Request<{ id: string }>,
            res: Response<GetShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindByIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindByIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findById',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return the shop if it exists', async () => {
            const shopId = 'shop1';
            const mockShop = { id: shopId, name: 'Test Shop' };

            shopRepoFindByIdStub.withArgs(shopId).resolves(mockShop);

            req = { params: { id: shopId } } as Request<{ id: string }>;
            await getShop(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShop)).to.be.true;
        });

        it('should return an error if the shop does not exist', async () => {
            shopRepoFindByIdStub.withArgs(sinon.match.any).resolves(null);

            req = { params: { id: 'nonexistentShop' } } as Request<{
                id: string;
            }>;
            await getShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindByIdStub
                .withArgs(sinon.match.any)
                .throws(new Error('Database error'));

            req = { params: { id: 'shop1' } } as Request<{ id: string }>;
            await getShop(req, res);
        });
    });
});
