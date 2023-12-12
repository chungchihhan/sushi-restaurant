import type {
    CreateShopPayload,
    CreateShopResponse,
    GetShopResponse,
    GetShopsCategoryResponse,
    GetShopsResponse,
} from '@lib/shared_types';
import { expect } from 'chai';
import type { Request, Response } from 'express';
import sinon from 'sinon';

import { CategoryList } from '../../../../lib/shared_types';
import {
    createShop,
    getShop,
    getShopByUserId,
    getShops,
    getShopsByCategory,
    getShopsCategory,
} from '../../controllers/shop';
import { MongoShopRepository } from '../../controllers/shop_repository';
import { MongoUserRepository } from '../../controllers/user_repository';
import ShopModel from '../../models/shop';

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
                { id: '2', name: 'Shop 2', category: '中式' },
            ];
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(mockShops);

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShops)).to.be.true;
        });

        it('should return an error if no shops are found for a category', async () => {
            shopRepoFindAllByCategoryStub.withArgs('中式').resolves(null);

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoFindAllByCategoryStub
                .withArgs('中式')
                .throws(new Error('Database error'));

            req = { params: { category: 'Chinese' } } as Request<{
                category: string;
            }>;
            await getShopsByCategory(req, res);
        });
    });

    describe('getShopByUserId', () => {
        let req: Request<{ user_id: string }>,
            res: Response<GetShopsResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            userRepoFindByIdStub: sinon.SinonStub,
            shopRepoFindByUserIdStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<GetShopsResponse | { error: string }>;
            statusStub.returns(res);

            userRepoFindByIdStub = sinon.stub(
                MongoUserRepository.prototype,
                'findById',
            );
            shopRepoFindByUserIdStub = sinon.stub(
                MongoShopRepository.prototype,
                'findByUserId',
            );
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the user does not exist', async () => {
            userRepoFindByIdStub.withArgs('nonexistentUser').resolves(null);

            req = { params: { user_id: 'nonexistentUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'User not found' })).to.be.true;
        });

        it('should return an error if the shop does not exist', async () => {
            userRepoFindByIdStub
                .withArgs('existingUser')
                .resolves({ id: 'existingUser' });
            shopRepoFindByUserIdStub.withArgs('existingUser').resolves(null);

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop not found' })).to.be.true;
        });

        it('should return the shop if the user and shop exist', async () => {
            const mockShop = { id: 'shop1' };
            userRepoFindByIdStub
                .withArgs('existingUser')
                .resolves({ id: 'existingUser' });
            shopRepoFindByUserIdStub
                .withArgs('existingUser')
                .resolves(mockShop);

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);

            expect(statusStub.calledWith(200)).to.be.true;
            expect(jsonSpy.calledWith(mockShop)).to.be.true;
        });

        it('should handle exceptions', async () => {
            userRepoFindByIdStub
                .withArgs('existingUser')
                .throws(new Error('Database error'));

            req = { params: { user_id: 'existingUser' } } as Request<{
                user_id: string;
            }>;
            await getShopByUserId(req, res);
        });
    });

    describe('createShop', () => {
        let req: Request<never, never, CreateShopPayload>,
            res: Response<CreateShopResponse | { error: string }>,
            statusStub: sinon.SinonStub,
            jsonSpy: sinon.SinonSpy,
            shopRepoExistsByNameStub: sinon.SinonStub;

        beforeEach(() => {
            statusStub = sinon.stub();
            jsonSpy = sinon.spy();
            res = {
                status: statusStub,
                json: jsonSpy,
            } as unknown as Response<CreateShopResponse | { error: string }>;
            statusStub.returns(res);

            shopRepoExistsByNameStub = sinon.stub(
                MongoShopRepository.prototype,
                'existsByName',
            );
            sinon
                .stub(ShopModel.prototype, 'save')
                .resolves({ id: 'newShopId' });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return an error if the shop already exists', async () => {
            shopRepoExistsByNameStub.resolves(true);

            req = { body: { name: 'Existing Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);

            expect(statusStub.calledWith(404)).to.be.true;
            expect(jsonSpy.calledWith({ error: 'Shop already exists' })).to.be
                .true;
        });

        it('should successfully create a shop and return its id', async () => {
            shopRepoExistsByNameStub.resolves(false);

            req = { body: { name: 'New Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);

            expect(statusStub.calledWith(201)).to.be.true;
            expect(jsonSpy.calledWith({ id: 'newShopId' })).to.be.true;
        });

        it('should handle exceptions', async () => {
            shopRepoExistsByNameStub.throws(new Error('Database error'));

            req = { body: { name: 'Test Shop' } } as Request<
                never,
                never,
                CreateShopPayload
            >;
            await createShop(req, res);
        });
    });
});
