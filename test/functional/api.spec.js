'use strict';
var should = require('should');
var Forte = require('../../index');
var forte;
var credentials = require('../credentials.json');

describe('Functional', function () {
    this.timeout(5000);

    beforeEach(function () {
        forte = new Forte(credentials);
        forte.setDevmode();
    });

    describe('customers', function () {
        var customerToken = null;

        beforeEach(function (done) {
            forte.customers.create({
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
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        it('lists all customers', function (done) {
            forte.customers.find({}, function (err, body) {
                should.not.exist(err);
                body.should.be.an.Object;
                body.results.should.be.an.Array;
                done();
            });
        });
        it('gets one customer', function (done) {
            forte.customers.find({
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

        var customerToken = null;

        beforeEach(function (done) {
            forte.customers.create({
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
                customer_token: customerToken
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        describe('credit card pay method', function () {
            it('creates the paymethod on a customer', function (done) {
                forte.paymethods.create({
                   "label": "Visa - 1234",
                   "notes": "Brown Work CC",
                   "card": {
                      "account_number": "4242424242424242",
                      "expire_month": 12,
                      "expire_year": 2015,
                      "card_verification_value": "123",
                      "card_type": "visa",
                      "name_on_card": "Dr. Emmett Brown",
                      "partial_auth_allowed": "balance"
                  }
                }, function (err, body) {
                    should.not.exist(err);
                    done();
                });
            });
        });

        describe('credit card pay method', function () {
            it('creates the paymethod on a customer', function (done) {
                forte.paymethods.create({
                   "label": "Brown Work- 1111",
                   "notes": "Brown Work Checking",
                   "echeck": {
                      "account_holder": "Jennifer McFly",
                      "account_number": "1111111111111",
                      "routing_number": "021000021",
                      "check_number": "1001",
                      "account_type": "checking"
                   }
                }, function (err, body) {
                    should.not.exist(err);
                    done();
                });
            });
        });
    });
});
