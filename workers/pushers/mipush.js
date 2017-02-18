'use strict';

var rpn = require('request-promise-native');
var config = require('../../config/config.json');

module.exports = function (clientToken, scoresObj) {
    var options = {
        uri: 'https://api.xmpush.xiaomi.com/v2/message/regid',
        method: 'POST',
        headers: {
            'Authorization': 'key=' + config.push.mipush.appSecret
        },
        // json: true,
        form: {
            payload: JSON.stringify(scoresObj),
            restricted_package_name: 'com.perqin.gua',
            pass_through: 1,
            registration_id: clientToken
        },
        resolveWithFullResponse: true
    };
    rpn(options).catch(function (err) {
        console.error('Error sending MiPush message: ', err);
    });
};