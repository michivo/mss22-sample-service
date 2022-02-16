'use strict';

const articleDao = require('../models/DAOs/articles.model');
const articleDto = require('../models/DTOs/article');

const add = async (req, res, _) => {
    await articleDao.add(req.body);
    res.status(200).send('OK').end();
};

const get = async (_, res, __) => {
    const allArticles = await articleDao.get();
    res.status(200).send(allArticles.map(articleDto)).end();
};

module.exports = {
    add,
    get,
};
