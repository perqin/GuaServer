'use strict';

var Score = require('../models/score');
var requester = require('../workers/requester');

function syncScores(studentId, cookie) {
    return Promise.resolve().then(function () {
        // Get all scores
        // TODO: Choose year and term
        return requester.pollScores(cookie);
    }).then(function (scores) {
        // Extract required fields
        return scores.map(function (value) {
            return {
                studentId: value['xh'],
                courseId: value['jxbh'],
                courseName: value['kcmc'],
                score: value['zpcj'],
                revealDate: Date.now()
            };
        });
    }).then(function (polled) {
        // Get scores in db
        return Score.find({ studentId: studentId }).exec().then(function (stored) {
            return {
                polled: polled,
                stored: stored
            };
        });
    }).then(function (unmerged) {
        // Merge them
        var merged = {
            createdScores: [],
            updatedScores: [],
            removedScores: []
        };
        var polledObj = {};
        unmerged.polled.forEach(function (value) {
            polledObj[value.courseId] = value;
        });
        var storedObj = {};
        unmerged.stored.forEach(function (value) {
            storedObj[value.courseId] = value;
        });
        unmerged.polled.forEach(function (polledOne) {
            var storedOne = storedObj[polledOne.courseId];
            if (!storedOne) {
                // This is a newly polled score
                merged.createdScores.push(polledOne);
            } else {
                // This is a shared one, check changes first
                if (polledOne.score !== storedOne.score) {
                    merged.updatedScores.push(polledOne);
                }
                // Remove it from storedObj so finally only deleted scores remain
                storedObj[polledOne.courseId] = null;
            }
        });
        unmerged.stored.forEach(function (storedOne) {
            if (storedObj[storedOne.courseId]) {
                merged.removedScores.push(storedOne);
            }
        });
        return merged;
    }).then(function (sync) {
        // Update changes to local database
        var promises = [];
        sync.createdScores.forEach(function (score) {
            promises.push(new Score({
                studentId: score.studentId,
                courseId: score.courseId,
                courseName: score.courseName,
                score: score.score,
                revealDate: Date.now()
            }).save());
        });
        sync.updatedScores.forEach(function (score) {
            promises.push(Score.updateOne({ courseId: score.courseId }, { score: score.score }).exec());
        });
        sync.removedScores.forEach(function (score) {
            promises.push(Score.remove({ courseId: score.courseId }).exec());
        });
        // Fire promises and resolve with sync
        return Promise.all(promises).then(function (res) {
            return sync;
        });
    });
}

module.exports = {
    syncScores: syncScores
};
