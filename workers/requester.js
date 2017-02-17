'use strict';

var rpn = require('request-promise-native');
var wjwScoreUrl = 'http://wjw.sysu.edu.cn/api/score?year2016-2017&term=1&pylb=01';
var config = require('./../config/config.json');

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
        if (checkRes(response.body)) {
            var resJson;
            return eval('resJson = ' + response.body).body.dataStores.kccjStore.rowSet.primary.filter(function (s) {
                return s['xnd'] === '2016-2017' && s['xq'] === '1';
            });
        } else {
            return [];
        }
    });
}

module.exports = {
    pollScores: pollScores
};
