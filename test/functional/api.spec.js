'use strict';
var should = require('should');
var Forte = require('../../index');
var forte;
var credentials = require('../credentials.json');

describe('Functional', function () {
    this.timeout(5000);

    beforeEach(function () {
        forte = new Forte();
        forte.setDevmode();
        forte.setBasicAuth(credentials.apiLoginId, credentials.secureTransactionKey);
        forte.setAuthHeader(credentials.accountId);
    });

    describe('customers', function () {
        var customerToken = null;

        beforeEach(function (done) {
            forte.customers.create({
                account_id: credentials.accountId,
                location_id: credentials.locationId,

                first_name: "Emmett",
                last_name: "Brown",
                company_name: "Brown Associates"

            }, function (err, body) {
                should.not.exist(err);
                body.should.be.a.Object;
                body.customer_token.should.be.a.String.and.be.ok;
                customerToken = body.customer_token;
                done();
            });
        });
        afterEach(function (done) {
            forte.customers.remove({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        it('lists all customers', function (done) {
            forte.customers.find({
                account_id: credentials.accountId,
                location_id: credentials.locationId
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object;
                body.results.should.be.an.Array;
                done();
            });
        });
        it('gets one customer', function (done) {
            forte.customers.find({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object.and.not.an.Array;
                body.customer_token.should.equal(customerToken);
                done();
            });
        });
        it('updates the customer details', function (done) {
            forte.customers.update({
                account_id: credentials.accountId,
                location_id: credentials.locationId,
                customer_token: customerToken,
                first_name: 'Dude',
                company_name: 'Dude Associates'
            }, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object.and.not.an.Array;
                body.customer_token.should.equal(customerToken);
                body.first_name.should.equal('Dude');
                body.company_name.should.equal('Dude Associates');
                done();
            });
        });
    });

    describe('payment methods', function () {
        
    });
});
