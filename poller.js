/**
 * Created by perqin on 17-2-11.
 */

var Polling = require('./models/polling');

function Poller() {
    this['pollings'] = {};
}

Poller.prototype.getPolling = function (studentId) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (studentId && studentId !== '' && self.pollings.hasOwnProperty(studentId)) {
            resolve(self.pollings[studentId]);
        } else {
            resolve(null);
        }
    });
};

Poller.prototype.createPolling = function (studentId, cookie, clientToken) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!studentId || studentId === '') {
            reject(new Error('ERROR_INVALID_STUDENT_ID'));
        } else if (self.pollings.hasOwnProperty(studentId) && self.pollings[studentId] !== null) {
            reject(new Error('ERROR_POLLING_ALREADY_EXISTS'));
        } else {
            var polling = self.pollings[studentId] = new Polling(studentId, cookie, clientToken);
            polling.startPolling().then(function () {
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
        } else if (!self.pollings.hasOwnProperty(studentId)) {
            reject(new Error('ERROR_POLLING_NOT_FOUND'));
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
