'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const controller = require('../../../../server/controllers/articles.controller');
const db = require('../../../../server/dataAccess/firestore-access');

describe('Articles Controller', () => {
    let addStub;
    describe('add articles', () => {
        it('should add a new article to the model', async () => {
            const responseData = {
                identifier: '123',
                identifierType: 'custom',
                name: 'hugo',
                description: 'foobar',
            };

            let addedData = {};
            addStub = sinon.stub(db, 'collection');
            addStub.withArgs('articles').returns({
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

    describe('get single article', () => {
        it('should get a single article from the model', async () => {
            const responseData = {
                identifier: '123',
                identifierType: 'custom',
                name: 'hugo',
                description: 'foobar',
            };

            addStub = sinon.stub(db, 'collection');
            const collection = {
                limit: (number) => {
                    expect(number).to.equal(1);
                    return collection;
                },
                get: () => ({ docs: [{ id: '123', data: () => responseData }] }),
            };
            addStub.withArgs('articles').returns({
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

            await controller.getById(req, res);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.send, responseData);
            sinon.assert.calledOnce(res.end);
        });
    });

    afterEach(() => {
        if (addStub) addStub.restore();
    });
});
