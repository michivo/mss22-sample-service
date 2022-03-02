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

    afterEach(() => {
        if (addStub) addStub.restore();
    });
});
