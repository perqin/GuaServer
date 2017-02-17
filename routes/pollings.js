'use strict';

var express = require('express');
var router = express.Router();

var pollingsController = require('../controllers/pollings-controller');
var scoresController = require('../controllers/scores-controller');

router.get('/:studentId', function(req, res) {
    var studentId = req.params.studentId;
    var cookie = req.body.cookie;
    Promise.resolve().then(function () {
        return pollingsController.authPolling(studentId, cookie);
    }).then(function (polling) {
        res.send({
            studentId: polling.studentId,
            service: polling.service
        });
    }).catch(function (err) {
        if (err.message === 'ERROR_POLLING_NOT_FOUND') {
            res.status(404).send({ msg: err.message });
        } else {
            console.error(err);
            res.status(400).send({ msg: err.message });
        }
    });
});

router.post('/:studentId', function (req, res) {
    var studentId = req.params.studentId;
    var cookie = req.body.cookie;
    var service = req.body.service;
    var clientToken = req.body.clientToken;
    Promise.resolve().then(function () {
        return pollingsController.createPolling(studentId, cookie, service, clientToken);
    }).then(function (polling) {
        res.send({
            studentId: polling.studentId,
            service: polling.service
        });
    }).catch(function (err) {
        console.error(err);
        res.status(400).send({ msg: err.message });
    });
    // poller.getPolling(studentId).then(function (polling) {
    //     if (polling !== null) {
    //         throw new Error('ERROR_POLLING_ALREADY_EXISTS');
    //     }
    // }).then(function () {
    //     return poller.createPolling(studentId, cookie, token);
    // }).then(function (polling) {
    //     res.send(JSON.stringify({
    //         student_id: polling.studentId
    //     }));
    // }).catch(function (err) {
    //     console.error(err);
    //     res.status(400).send({ msg: err.message });
    // });
});

router.post('/:studentId/sync', function (req, res) {
    var studentId = req.params.studentId;
    var cookie = req.body.cookie;
    Promise.resolve().then(function () {
        return pollingsController.authPolling(studentId, cookie);
    }).then(function () {
        return scoresController.syncScores(studentId, cookie);
    }).then(function (sync) {
        res.send(sync);
    }).catch(function (err) {
        if (err.message === 'ERROR_POLLING_NOT_FOUND') {
            res.status(404).send({ msg: err.message });
        } else {
            console.error(err);
            res.status(400).send({ msg: err.message });
        }
    });
});

router.put('/:studentId', function (req, res) {
    var studentId = req.params.studentId;
    var cookie = req.body.cookie;
    var service = req.body.service;
    var clientToken = req.body.clientToken;
    Promise.resolve().then(function () {
        return pollingsController.authPolling(studentId, cookie);
    }).then(function () {
        return pollingsController.changePushService(studentId, service, clientToken);
    }).then(function (polling) {
        res.send({
            studentId: polling.studentId,
            service: polling.service
        });
    }).catch(function (err) {
        console.error(err);
        res.status(400).send({ msg: err.message });
    });
});

router.delete('/:studentId', function (req, res) {
    var studentId = req.params.studentId;
    var cookie = req.body.cookie;
    Promise.resolve().then(function () {
        return pollingsController.authPolling(studentId, cookie);
    }).then(function () {
        return pollingsController.removePolling(studentId);
    }).then(function () {
        res.status(200).end();
    }).catch(function (err) {
        if (err.message === 'ERROR_POLLING_NOT_FOUND') {
            res.status(404).send({ msg: err.message });
        } else {
            console.error(err);
            res.status(400).send({ msg: err.message });
        }
    });
    // poller.getPolling(studentId).then(function (polling) {
    //     if (polling === null) {
    //         throw new Error('ERROR_POLLING_NOT_FOUND');
    //     }
    //     return poller.removePolling(studentId);
    // }).then(function () {
    //     res.status(200).end();
    // }).catch(function (err) {
    //     if (err.message === 'ERROR_POLLING_NOT_FOUND') {
    //         res.status(404).send({ msg: err.message });
    //     } else {
    //         res.status(400).send({ msg: err.message });
    //     }
    // });
});

module.exports = router;
