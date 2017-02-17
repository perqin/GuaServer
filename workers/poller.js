'use strict';

var Polling = require('./../models/polling');

/**
 * Poller worker to manage pollings
 * @constructor
 * @property pollings The pollings
 */
function Poller() {
    this.pollings = {};
}

Poller.prototype.getPolling = function (studentId) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (studentId && studentId !== '' && self.pollings[studentId]) {
            resolve(self.pollings[studentId]);
        } else {
            resolve(null);
        }
    });
};

Poller.prototype.createPolling = function (studentId, cookie, service, clientToken) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!studentId || studentId === '') {
            reject(new Error('ERROR_INVALID_STUDENT_ID'));
        } else if (self.pollings[studentId]) {
            reject(new Error('ERROR_POLLING_ALREADY_EXISTS'));
        } else {
            var polling = new Polling(studentId, cookie, service, clientToken);
            polling.startPolling().then(function () {
                self.pollings[studentId] = polling;
                resolve(polling);
            }).catch(function (err) {
                reject(err);
            });
        }
    });
};

Poller.prototype.removePolling = function (studentId) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!studentId || studentId === '') {
            reject(new Error('ERROR_INVALID_STUDENT_ID'));
        } else {
            self.pollings[studentId].stopPolling().then(function () {
                self.pollings[studentId] = null;
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        }
    });
};

module.exports = Poller;
