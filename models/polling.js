/**
 * Created by perqin on 17-2-11.
 */

var Score = require('./score');
var requester = require('../requester');
var config = require('../config/config.json');

function Polling(studentId, cookie, clientToken) {
    this.studentId = studentId;
    this.cookies = cookie;
    this.clientToken = clientToken;
    this.scheduler = null;
    this.interval = config.interval * 60 * 1000;
}

Polling.prototype.startPolling = function () {
    var self = this;
    return new Promise(function (res, rej) {
        if (!self.scheduler) {
            self.scheduler = setInterval(worker(self.clientToken, self.cookies), self.interval);
            res(self);
        } else {
            rej(new Error('ERROR_ALREADY_STARTED'));
        }
    });
};

Polling.prototype.stopPolling = function () {
    var self = this;
    return new Promise(function (res, rej) {
        if (self.scheduler) {
            clearInterval(self.scheduler);
            self.scheduler = null;
            res(self);
        } else {
            rej(new Error('ERROR_ALREADY_STOPPED'));
        }
    });
};

function worker(clientToken, cookie) {
    var scoreExtractor = function (value) {
        return {
            student_id: value['xh'],
            course_id: value['jxbh'],
            course_name: value['kcmc'],
            score: value['zpcj'],
            reveal_date: Date.now()
        };
    };

    return function () {
        requester.pollScores(cookie).then(function (scores) {
            console.log('Get scores: ' + scores.length);
            scores.map(scoreExtractor).forEach(function (score) {
                Score.find({ course_id: score.course_id }).exec().then(function (found) {
                    if (found.length === 1) {
                        throw new Error('ERROR_ALREADY_EXISTS');
                    }
                }).catch(function (err) {
                    // Eat ERROR_ALREADY_EXISTS in console
                    if (err.message !== 'ERROR_ALREADY_EXISTS') throw err;
                }).then(function () {
                    return requester.pushToDevice(clientToken, score);
                }).then(function () {
                    return new Score({
                        student_id: score.student_id,
                        course_id: score.course_id,
                        course_name: score.course_name,
                        score: score.score,
                        reveal_date: score.reveal_date
                    }).save();
                }).catch(console.error);
            });
        });
    };
}

module.exports = Polling;
