'use strict';
var request = require('request');
var debug = require('debug')('forte');

var Forte = function ForteClass(defaults) {
    defaults = defaults || {};

    var self = this;

    // TODO: once ready for production, add the base url endpoint here.
    self._base = "";
    self.account_id = defaults.account_id || "";
    self.basicAuth = {
        username: defaults.apiLoginId || '',
        password: defaults.secureTransactionKey || ''
    };

    self.location_id = defaults.location_id || '';

    self.setDevmode = function setDevmode() {
        self._base = 'https://sandbox.forte.net/api/v1';
        return self;
    };

    self._request = function _request(opts, callback) {
        opts = opts || { };
        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        opts.uri = self._base + opts.uri;

        opts.headers = {
            'X-Forte-Auth-Account-Id': opts.body.account_id || self.account_id
        };

        opts.auth = self.basicAuth;

        if (!opts.body.account_id) opts.body.account_id = self.account_id;
        if (!opts.body.location_id) opts.body.location_id = self.location_id;

        debug('request', opts);
        request(opts, function onAfterRequest(err, res, body) {
            debug('response', res.statusCode, err || body);
            if (err || res.statusCode < 200 || res.statusCode > 299) {
                return callback(err || body || "Error: status=" + res.statusCode);
            }
            callback(null, body);
        });
    };


    self.customers = {
        find: function find(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + (params.customer_token || '');
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function create(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/customers';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function update(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function remove(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token;
            self._request({
                uri: uri,
                method: 'DELETE'
            }, callback);
        }
    };


    self.transactions = {
        find: function find(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.transaction_id;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function create(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/transactions';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function update(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.transaction_id;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        }
    };

    self.paymethods = {
        findByLocation: function findByLocation(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findByCustomer: function findByCustomer(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_id + '/paymethods';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findById: function findById(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods/' + params.paymethod_token;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function create(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function update(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods/' + params.paymethod_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function remove(params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods/' + params.paymethod_token;
            self._request({
                uri: uri,
                method: 'DELETE',
                body: params
            }, callback);
        }
    };


    return self;
};


module.exports = Forte;
