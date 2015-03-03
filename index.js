'use strict';
var request = require('request');

var Forte = function () {
    this._base = "";
    this._authHeader = "";
    this._basicAuth = {
        username: '',
        password: ''
    };
    return this;
};

Forte.prototype.setDevmode = function () {
    this._base = 'https://sandbox.forte.net/api/v1';
    return this;
};

Forte.prototype.setAuthHeader = function (token) {
    this._authHeader = token;
    return this;
};

Forte.prototype.setBasicAuth = function (username, password) {
    this._basicAuth.username = username;
    this._basicAuth.password = password;
    return this;
};

Forte.prototype.request = function (opts, callback) {
    opts = opts || { };
    if (opts.json === undefined) opts.json = true;
    
    opts.uri = this._base + opts.uri;
    
    opts.headers = {
        'X-Forte-Auth-Account-Id': this._authHeader
    };
    
    opts.auth = this._basicAuth;
    
    request(opts, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            return callback(err || body || "Error: status=" + res.statusCode);
        }
        callback(null, body);
    });
};

Forte.prototype.ping = function (callback) {
    this.request({
        uri: '/',
        method: 'GET'
    }, callback);
};


module.exports = Forte;
