'use strict';

const appRoot = '../../../../server';
const sinon = require('sinon');
const request = require('supertest');
const controller = require(`${appRoot}/controllers/articles.controller`);

describe('Comments route v1', () => {
    const app = require('../../../../app');

    describe('GET /articles', () => {
        let getStub;
        before(() => {
            getStub = sinon.stub(controller, 'get');
            getStub.callsFake((req, res) => {
                res.status(200).send({ article: 'Hello', userName: 'Michael' });
            });
        });

        after(() => {
            getStub.restore();
        });

        it('should return data from controller', (done) => {
            request(app)
                .get('/api/v1/articles')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('POST /articles', () => {
        let addStub;
        before(() => {
            addStub = sinon.stub(controller, 'add');
            addStub.callsFake((req, res) => {
                res.status(200).send('OK');
            });
        });

        after(() => {
            addStub.restore();
        });

        it('should return 200 for valid articles', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifier: '1234567890128', identifierType: 'ean13', name: 'Milk', description: 'Fresh Milk' })
                .set('Content-Type', 'application/json')
                .expect(200, done);
        });

        it('should return 400 for articles with missing identifier', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifierType: 'ean13', name: 'Milk', description: 'Fresh Milk' })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });

        it('should return 400 for articles with missing identifier type', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifier: '1234567890128', name: 'Milk', description: 'Fresh Milk' })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });

        it('should return 400 for articles with invalid identifier type', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifier: '1234567890128', identifierType: 'ean14', name: 'Milk', description: 'Fresh Milk' })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });

        it('should return 400 for articles with missing name', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifier: '1234567890128', identifierType: 'ean13', description: 'Fresh Milk' })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });

        it('should return 400 for articles with missing description', (done) => {
            request(app)
                .post('/api/v1/articles')
                .send({ identifier: '1234567890128', identifierType: 'ean13', name: 'Milk' })
                .set('Content-Type', 'application/json')
                .expect(400, done);
        });
    });
});
