'use strict';
var request = require('request');

var forte = {};
module.exports = forte;

forte.base = "";

forte.setDevmode = function () {
    forte.base = 'https://sandbox.forte.net/api/v1';
};


forte.request = function (opts, callback) {
    opts = opts || { };
    if (opts.json === undefined) opts.json = true;
    
    opts.uri = forte.base + opts.uri;
    
    request(opts, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            return callback(err || body || "Error: status=" + res.statusCode);
        }
        callback(null, body);
    });
};

forte.ping = function (callback) {
    forte.request({
        uri: '/',
        method: 'GET'
    }, callback);
};
