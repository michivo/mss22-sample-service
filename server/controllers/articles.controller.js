'use strict';

const articleDao = require('../models/DAOs/articles.model');
const articleDto = require('../models/DTOs/article');

const add = async (req, res, _) => {
    const addedItem = await articleDao.add(req.body);
    res.status(200).send(articleDto(addedItem)).end();
};

const getAll = async (_, res, __) => {
    const allArticles = await articleDao.getAll();
    res.status(200).send(allArticles.map(articleDto)).end();
};

const getById = async (req, res, _) => {
    const identifier = req.params.articleIdentifier;
    const article = await articleDao.getById(identifier);
    if (!article) {
        res.status(404).send(`Article with identifier ${identifier} could not be found.`);
    } else {
        res.status(200).send(articleDto(article)).end();
    }
};

module.exports = {
    add,
    getAll,
    getById,
};
