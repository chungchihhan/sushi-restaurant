import type {
    GetShopResponse,
    GetShopsCategoryResponse,
    GetShopsResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { CategoryList } from '../../../../lib/shared_types';
import { getShop, getShops, getShopsCategory, getShopsByCategory } from '../../controllers/shop';

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

    describe('getShopsCategory', () => {
        let res: Response<GetShopsCategoryResponse>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsCategoryResponse>;
            statusStub.returns(res);

            shopRepoFindAllStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAll',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return category counts for all shops', async () => {
            const mockShops = [
                { id: '1', category: CategoryList.Chinese },
                { id: '2', category: CategoryList.American },
            ];

            shopRepoFindAllStub.resolves(mockShops);

            await getShopsCategory({} as Request, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(
                jsonSpy.calledWith([
                    { category: CategoryList.Chinese, totalSum: 1 },
                    { category: CategoryList.American, totalSum: 1 },
                ]),
            ).to.be.true;
        });

        it('should throw an error if there are shops with invalid categories', async () => {
            const mockShops = [{ id: '1', category: 'InvalidCategory' }];

            shopRepoFindAllStub.resolves(mockShops);

            await getShopsCategory({} as Request, res);
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllStub.throws(new Error('Database error'));

            await getShopsCategory({} as Request, res);
        });
    });

    describe('getShopsByCategory', () => {
        let req: Request<{ category: string }>,
            res: Response<GetShopsResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoFindAllByCategoryStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoFindAllByCategoryStub = sinon.stub(
                MongoShopRepository.prototype,
                'findAllByCategory',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return shops for a valid category', async () => {
            const mockShops = [
                { id: '1', name: 'Shop 1', category: '中式' },
                { id: '2', name: 'Shop 2', category: '中式' }
            ];
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(mockShops);

            req = { params: { category: 'Chinese' } } as Request<{ category: string }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShops)).to.be.true;
        });

        it('should return an error if no shops are found for a category', async () => {
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(null);

            req = { params: { category: 'Chinese' } } as Request<{ category: string }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllByCategoryStub.withArgs('中式').throws(new Error('Database error'));

            req = { params: { category: 'Chinese' } } as Request<{ category: string }>;
            await getShopsByCategory(req, res);
        });
    });
});
