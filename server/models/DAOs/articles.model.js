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

async function getAll() {
    const articleRef = await db.collection(articleCollection);
    const snapshot = await articleRef.get();
    return snapshot.docs.map(c => DaoContainer.create(c, ArticleDao));
}

async function getById(identifier) {
    const articleRef = await db.collection(articleCollection)
        .where('identifier', '==', identifier)
        .limit(1);
    const snapshot = await articleRef.get();
    if (snapshot.docs.length > 0) {
        return DaoContainer.create(snapshot.docs[0], ArticleDao);
    } else {
        return undefined;
    }

}

module.exports = {
    getAll,
    getById,
    add,
    ArticleDao,
};
