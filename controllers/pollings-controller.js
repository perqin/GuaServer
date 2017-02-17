/**
 * Created by perqin on 17-2-17.
 */
'use strict';

var Poller = require('../poller');
var poller = new Poller();

function authPolling(studentId, cookie) {
    return poller.getPolling(studentId).then(function (polling) {
        if (!polling) throw new Error('ERROR_POLLING_NOT_FOUND');
        if (polling.cookie !== cookie) throw new Error('ERROR_UNAUTHORIZED');
        return polling;
    });
}

function changePushService(studentId, service, clientToken) {
    return poller.getPolling(studentId).then(function (polling) {
        polling.service = service;
        polling.clientToken = clientToken;
        return polling;
    });
}

module.exports = {
    authPolling: authPolling,
    changePushService: changePushService
};
