'use strict';

var Poller = require('../workers/poller');
var poller = new Poller();

function authPolling(studentId, cookie) {
    return poller.getPolling(studentId).then(function (polling) {
        if (!polling) throw new Error('ERROR_POLLING_NOT_FOUND');
        if (polling.cookie !== cookie) throw new Error('ERROR_UNAUTHORIZED');
        return polling;
    });
}

function createPolling(studentId, cookie, service, clientToken) {
    return poller.createPolling(studentId, cookie, service, clientToken);
}

function removePolling(studentId) {
    return poller.removePolling(studentId);
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
    createPolling: createPolling,
    removePolling: removePolling,
    changePushService: changePushService
};
