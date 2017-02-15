/**
 * Created by perqin on 17-2-11.
 */

var rpn = require('request-promise-native');
var base64 = require('base-64');
var wjwScoreUrl = 'http://wjw.sysu.edu.cn/api/score?year2016-2017&term=1&pylb=01';
var firebaseAdmin = require('firebase-admin');
var config = require('./config/config.json');

var serviceAccount = require('./config/service-account-credentials.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: config.firebaseDatabaseUrl
});

function pollScores(cookie) {
    var checkRes = function (res) {
        return true;
    };
    var options = {
        uri: wjwScoreUrl,
        method: 'GET',
        headers: {
            'Cookie': cookie
        },
        resolveWithFullResponse: true
    };
    return rpn(options).then(function (response) {
        console.log(response.body);
        if (checkRes(response.body)) {
            return eval('resJson = ' + response.body).body.dataStores.kccjStore.rowSet.primary.filter(function (s) {
                return s['xnd'] === '2016-2017' && s['xq'] === '1';
            });
        } else {
            return [];
        }
    });
}

function pushToDevice(clientToken, scoreObj) {
    var payload = {
        data: {
            new_score: JSON.stringify(scoreObj)
        }
    };
    return firebaseAdmin.messaging().sendToDevice(clientToken, payload).then(function (response) {
        console.log('Successfully sent: ', response);
    }).catch(function (err) {
        console.error('Error sending message: ', err);
    });
}

module.exports = {
    pollScores: pollScores,
    pushToDevice: pushToDevice
};
