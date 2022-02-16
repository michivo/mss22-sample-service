'use strict';

function createArticleDto(articleContainer) {
    return {
        identifier: articleContainer.data.identifier,
        identifierType: articleContainer.data.identifierType,
        name: articleContainer.data.name,
        description: articleContainer.data.description,
    };
}

module.exports = createArticleDto;
