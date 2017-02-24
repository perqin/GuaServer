'use strict';

var rpn = require('request-promise-native');
var base64 = require('base-64');
var config = require('../../config/config.json');

module.exports = function (clientToken, scoresObj) {
    var options = {
        uri: 'https://api.jpush.cn/v3/push',
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + base64.encode(config.push.jpush.appKey + ':' + config.push.jpush.masterSecret)
        },
        json: true,
        body: {
            platform: ['android'],
            audience: {
                registration_id: [clientToken]
            },
            message: {
                msg_content: JSON.stringify(scoresObj)
            }
        }
    };
    rpn(options).catch(function (err) {
        console.error('Error sending JPush message: ', err);
    });
};
