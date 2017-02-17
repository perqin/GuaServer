'use strict';

var firebaseAdmin = require('firebase-admin');

var serviceAccount = require('./../../config/service-account-credentials.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: config.firebaseDatabaseUrl
});

module.exports = function (clientToken, scoresObj) {
    var payload = {
        data: {
            sync: JSON.stringify(scoresObj)
        }
    };
    return firebaseAdmin.messaging().sendToDevice(clientToken, payload).catch(function (err) {
        console.error('Error sending message: ', err);
    });
};
