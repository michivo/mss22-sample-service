'use strict';

const db = require('../../dataAccess/firestore-access');
const DaoContainer = require('./dao-container');

const articleCollection = 'articles';

class ArticleDao {
    constructor({ identifier, identifierType, name, description }) {
        this.identifier = identifier;
        this.identifierType = identifierType;
        this.name = name;
        this.description = description;
    }
}

async function add(article) {
    const articleRef = await db.collection(articleCollection).add(article);
    const snapshot = await articleRef.get();
    return DaoContainer.create(snapshot, ArticleDao);
}

async function get() {
    const articleRef = await db.collection(articleCollection);
    const snapshot = await articleRef.get();
    return snapshot.docs.map(c => DaoContainer.create(c, ArticleDao));
}

module.exports = {
    get,
    add,
    ArticleDao,
};
