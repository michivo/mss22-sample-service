'use strict';

const admin = require('firebase-admin');

try {
    const serviceAccount = require('../../secret/firestoreAccountKey.json');
    console.log('Initializing firestore with local account key.');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} catch (ex) {
    if (ex instanceof Error && ex.code === 'MODULE_NOT_FOUND') {
        console.log('Initializing firestore with application defaults.');
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    } else {
        throw ex;
    }
}

module.exports = admin.firestore();
