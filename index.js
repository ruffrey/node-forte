'use strict';
var request = require('request');
var debug = require('debug')('forte');

var Forte = function () {
    this._base = "";
    this._authHeader = "";
    this._basicAuth = {
        username: '',
        password: ''
    };
    return this;
};

Forte.prototype.setDevmode = function setDevmode() {
    this._base = 'https://sandbox.forte.net/api/v1';
    return this;
};

Forte.prototype.setAuthHeader = function setAuthHeader(token) {
    this._authHeader = token;
    return this;
};

Forte.prototype.setBasicAuth = function setBasicAuth(username, password) {
    this._basicAuth.username = username;
    // this._basicAuth.username = new Buffer(username).toString('base64');
    this._basicAuth.password = password;
    // this._basicAuth.password = new Buffer(password).toString('base64');
    return this;
};

Forte.prototype._request = function _request(opts, callback) {
    opts = opts || { };
    if (opts.json === undefined) opts.json = true;
    if (!opts.body) opts.body = { };
    opts.uri = this._base + opts.uri;
    
    opts.headers = {
        'X-Forte-Auth-Account-Id': opts.body.account_id || this._authHeader
    };
    
    opts.auth = this._basicAuth;
    
    debug('request', opts);
    request(opts, function onAfterRequest(err, res, body) {
        debug('response', err || body);
        if (err || res.statusCode !== 200) {
            return callback(err || body || "Error: status=" + res.statusCode);
        }
        callback(null, body);
    });
};

Forte.prototype.ping = function ping(callback) {
    this._request({
        uri: '/',
        method: 'GET'
    }, callback);
};

Forte.prototype.customers = {
    find: function find(params, callback) {
        var uri = '/accounts/' + params.account_id + '/locations/' +
            params.location_id + '/customers/' + 
            params.customer_id;
        this.request({
            uri: uri,
            method: 'GET',
            body: params
        }, callback);
    },
    create: function create(params, callback) {
        var uri = '/accounts/' + params.account_id + '/customers';
        this.request({
            uri: uri,
            method: 'POST',
            body: params
        }, callback);
    },
    update: function update(params, callback) {
        var uri = '/accounts/' + params.account_id + '/locations/' +
            params.location_id + '/customers/' + 
            params.customer_id;
        this.request({
            uri: uri,
            method: 'PUT',
            body: params
        }, callback);
    },
    remove: function remove(params, callback) {
        var uri = '/accounts/' + params.account_id + '/locations/' +
            params.location_id + '/customers/' + 
            params.customer_id;
        this.request({
            uri: uri,
            method: 'DELETE'
        }, callback);
    }
};

Forte.prototype.transactions = {
    find: function find(params, callback) {
        var uri = '/accounts/' + params.account_id + '/locations/' +
            params.location_id + '/transactions/' + 
            params.transaction_id;
        this.request({
            uri: uri,
            method: 'GET',
            body: params
        }, callback);
    },
    create: function create(params, callback) {
        var uri = '/accounts/' + params.account_id + '/transactions';
        this.request({
            uri: uri,
            method: 'POST',
            body: params
        }, callback);
    },
    update: function update(params, callback) {
        var uri = '/accounts/' + params.account_id + '/locations/' +
            params.location_id + '/transactions/' + 
            params.transaction_id;
        this.request({
            uri: uri,
            method: 'PUT',
            body: params
        }, callback);
    }
};

module.exports = Forte;
