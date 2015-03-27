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
        if (!callback) debug('request without callback');
        callback = callback || function () { };

        if (opts.json === undefined) opts.json = true;
        if (!opts.body) opts.body = { };
        if (opts.body.qs) {
            opts.qs = opts.body.qs;
            delete opts.body.qs;
        }
        opts.uri = self._base + opts.uri;

        opts.headers = {
            'X-Forte-Auth-Account-Id': opts.body.account_id || self.account_id
        };

        opts.auth = self.basicAuth;

        if (!opts.body.account_id) opts.body.account_id = self.account_id;
        if (!opts.body.location_id) opts.body.location_id = self.location_id;

        debug('request', opts);
        request(opts, function onAfterForteRequest(err, res, body) {
            debug('response', res ? res.statusCode : res, err || body);
            if (err || res.statusCode < 200 || res.statusCode > 299) {
                return callback(err || body || "Error: status=" + res.statusCode);
            }
            callback(null, body);
        });
    };


    self.customers = {
        find: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findById: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/customers';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token;
            self._request({
                uri: uri,
                method: 'DELETE'
            }, callback);
        }
    };

    self.addresses = {
        findByCustomer: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + (params.customer_token || '') +
                '/addresses';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/addresses';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        // This does not seem to work as documented.
        update: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token +
                '/addresses/' + params.address_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/addresses/' + params.address_token;
            self._request({
                uri: uri,
                method: 'DELETE',
                body: params
            }, callback);
        }
    };

    self.transactions = {
        findById: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.transaction_id;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findByCustomer: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token +
                '/transactions';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findByType: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.type;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        find: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        update: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.transaction_id;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        create: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/transactions';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        }
    };

    // Transaction type specific actions
    self.actions = ['sale', 'disburse', 'authorize', 'verify', 'inquiry', 'force'];
    self.actions.forEach(function (a) {
        self.transactions[a] = function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/' + a;
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        };
    });

    self.paymethods = {
        findByLocation: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findByCustomer: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/customers/' + params.customer_token + '/paymethods';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        findById: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods/' + params.paymethod_token;
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        },
        create: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods';
            self._request({
                uri: uri,
                method: 'POST',
                body: params
            }, callback);
        },
        update: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/paymethods/' + params.paymethod_token;
            self._request({
                uri: uri,
                method: 'PUT',
                body: params
            }, callback);
        },
        remove: function (params, callback) {
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

    self.settlements = {
        findByTransaction: function (params, callback) {
            var uri = '/accounts/' + (params.account_id || self.account_id) +
                '/locations/' + (params.location_id || self.location_id) +
                '/transactions/' + params.transaction_id +
                '/settlements';
            self._request({
                uri: uri,
                method: 'GET',
                body: params
            }, callback);
        }
    };


    return self;
};


module.exports = Forte;
