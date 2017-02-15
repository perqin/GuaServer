var express = require('express');
var router = express.Router();

var Poller = require('../poller');
var poller = new Poller();

router.get('/:student_id', function(req, res, next) {
    poller.getPolling(req.params.student_id).then(function (polling) {
        if (polling === null) {
            throw new Error('ERROR_POLLING_NOT_FOUND');
        }
        return polling;
    }).then(function (polling) {
        res.send(JSON.stringify({
            student_id: polling.studentId
        }));
    }).catch(function (err) {
        if (err.message === 'ERROR_POLLING_NOT_FOUND') {
            res.status(404).send({ msg: err.message });
        } else {
            res.status(400).send({ msg: err.message });
        }
    });
});

router.post('/:student_id', function (req, res, next) {
    var studentId = req.params.student_id;
    var cookie = req.body.cookie;
    var token = req.body.client_token;
    poller.getPolling(studentId).then(function (polling) {
        if (polling !== null) {
            throw new Error('ERROR_POLLING_ALREADY_EXISTS');
        }
    }).then(function () {
        return poller.createPolling(studentId, cookie, token);
    }).then(function (polling) {
        res.send(JSON.stringify({
            student_id: polling.studentId
        }));
    }).catch(function (err) {
        console.error(err);
        res.status(400).send({ msg: err.message });
    });
});

router.delete('/:student_id', function (req, res, next) {
    var studentId = req.params.student_id;
    poller.getPolling(studentId).then(function (polling) {
        if (polling === null) {
            throw new Error('ERROR_POLLING_NOT_FOUND');
        }
        return poller.removePolling(studentId);
    }).then(function () {
        res.status(200).end();
    }).catch(function (err) {
        if (err.message === 'ERROR_POLLING_NOT_FOUND') {
            res.status(404).send({ msg: err.message });
        } else {
            res.status(400).send({ msg: err.message });
        }
    });
});

module.exports = router;
