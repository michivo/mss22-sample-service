'use strict';

class DaoContainer {
    static create(doc, Model) {
        return new DaoContainer(doc.id, new Model(doc.data()));
    }

    constructor(id, data) {
        this.id = id;
        this.data = data;
    }
}

module.exports = DaoContainer;
