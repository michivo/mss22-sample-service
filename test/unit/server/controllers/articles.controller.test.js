'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const controller = require('../../../../server/controllers/articles.controller');
const db = require('../../../../server/dataAccess/firestore-access');

describe('Articles Controller', () => {
    let collectionStub;
    describe('add', () => {
        it('adds a new article to the model', async () => {
            const responseData = {
                identifier: '123',
                identifierType: 'custom',
                name: 'hugo',
                description: 'foobar',
            };

            let addedData = {};
            collectionStub = sinon.stub(db, 'collection');
            collectionStub.withArgs('articles').returns({
                add: data => {
                    addedData = data;
                    return Promise.resolve(
                        {
                            get: () => ({
                                id: '12345',
                                data: () => responseData,
                            }),
                        },
                    );
                },
            });

            const res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            res.end = sinon.stub().returns(res);
            const req = { body: { identifier: '1234567890128', identifierType: 'ean13', name: 'Milk', description: 'Fresh Milk' } };

            await controller.add(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, responseData);
            sinon.assert.calledOnce(res.end);
            expect(addedData).to.equal(req.body);
        });
    });

    describe('getById', () => {
        it('gets a single article from the model', async () => {
            // arrange
            const responseData = {
                identifier: '123',
                identifierType: 'custom',
                name: 'hugo',
                description: 'foobar',
            };

            collectionStub = sinon.stub(db, 'collection');
            const collection = {
                limit: (number) => {
                    expect(number).to.equal(1);
                    return collection;
                },
                get: () => ({ docs: [{ id: '123', data: () => responseData }] }),
            };
            collectionStub.withArgs('articles').returns({
                where: (paramName, operator, value) => {
                    expect(paramName).to.equal('identifier');
                    expect(operator).to.equal('==');
                    expect(value).to.equal('1234567890128');
                    return collection;
                },
            });

            const res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            res.end = sinon.stub().returns(res);
            const req = { params: { articleIdentifier: '1234567890128' } };

            // act
            await controller.getById(req, res);

            // assert
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, responseData);
            sinon.assert.calledOnce(res.end);
        });
    });

    describe('getAll', () => {
        it('should get all articles from the model', async () => {
            // arrange
            const responseData = [{
                identifier: '12345',
                identifierType: 'custom',
                name: 'hugo',
                description: 'foobar',
            },
            {
                identifier: '54321',
                identifierType: 'custom',
                name: 'hansi',
                description: 'foobar',
            }];

            collectionStub = sinon.stub(db, 'collection');
            const collection = {
                get: () => ({
                    docs: [
                        { id: '123', data: () => responseData[0] },
                        { id: '234', data: () => responseData[1] },
                    ],
                }),
            };
            collectionStub.withArgs('articles').returns(collection);

            const res = {};
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns(res);
            res.end = sinon.stub().returns(res);

            await controller.getAll({}, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, responseData);
            sinon.assert.calledOnce(res.end);
        });
    });

    afterEach(() => {
        if (collectionStub) collectionStub.restore();
    });
});
