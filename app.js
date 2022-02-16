'use strict';

const express = require('express');
const router = express.Router();

const app = express();
app.use(express.json());
app.use(router);

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Articles API',
            version: '1.0.0',
        },
    },
    apis: ['./server/routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use('/api/v1/articles', require('./server/routes/articles.routes.v1'));

// Start the server
const PORT = process.env.PORT || 8080;
if (!module.parent) {
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}

module.exports = app;
