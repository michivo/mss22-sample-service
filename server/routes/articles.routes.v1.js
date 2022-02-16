'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/articles.controller');

const router = express.Router();

/**
   * @openapi
   * definitions:
   *   ArticleV1:
   *     required:
   *       - identifier
   *       - identifierType
   *       - name
   *       - description
   *     properties:
   *       identifier:
   *         type: string
   *       identifierType:
   *         type: string
   *         enum:
   *           - ean13
   *           - custom
   *       name:
   *         type: string
   *       description:
   *         type: string
   */

/**
   * @openapi
   * tags:
   *   name: Articles V1
   *   description: Posting and getting articles
   */

/**
 * @openapi
 * /api/v1/articles:
 *   get:
 *     tags:
 *       - Articles V1
 *     produces:
 *       - application/json
 *     description: Gets a list of all articles.
 *     summary: Gets all articles.
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ArticleV1'
 */
router.get('/', (req, res) => {
    return controller.get(req, res);
});

/**
 * @openapi
 * /api/v1/articles:
 *   post:
 *     tags:
 *       - Articles V1
 *     description: Adds a new article with article number, name and description.
 *     summary: Create new article.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/ArticleV1'
 *     responses:
 *       200:
 *         description: Article was added successfully.
 */
router.post('/',
    body('identifier').isString().notEmpty(),
    body('identifierType').isString().notEmpty().custom((value, _) => value === 'ean13' || value === 'custom'),
    body('name').isString().notEmpty(),
    body('description').isString().notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await controller.add(req, res);
    });

module.exports = router;
