'use strict';

var pushers = {
    fcm: require('./fcm'),
    jpush: require('./jpush'),
    mipush: require('./mipush')
};

function push(service, clientToken, scoreObj) {
    if (!pushers[service]) {
        return Promise.reject(new Error('ERROR_UNSUPPORTED_PUSH_SERVICE'));
    } else {
        return pushers[service](clientToken, scoreObj);
    }
}

module.exports = {
    push: push
};
