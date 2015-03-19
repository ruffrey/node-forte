'use strict';
var should = require('should');
var async = require('async');
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
            it('is created without a customer and returns a token', function (done) {
                forte.paymethods.create({
                   "label": "Visa - 1234",
                   "notes": "Brown",
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
                    body.notes.should.equal('Brown');
                    should.exist(body.paymethod_token);
                    body.paymethod_token.should.be.type('string');
                    done();
                });
            });
        });

        describe('echeck paymethod', function () {

            it('is created, updated, and deleted on a customer', function (done) {
                var token;
                async.series([
                    function (cb) {
                        forte.paymethods.create({
                            customer_token: customerToken,
                           "label": "Brown",
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
                            should.exist(body.paymethod_token);
                            body.label.should.equal('Brown');
                            should.exist(body.customer_token);
                            body.customer_token.should.equal(customerToken);
                            token = body.paymethod_token;
                            cb();
                        });
                    },
                    function (cb) {
                        forte.paymethods.update({
                            paymethod_token: token,
                            label: "Brummel"
                        }, function (err, body) {
                            should.not.exist(err);
                            body.label.should.equal('Brummel');
                            cb();
                        });
                    },
                    function (cb) {
                        forte.paymethods.remove({
                            paymethod_token: token
                        }, function (err, body) {
                            should.not.exist(err);
                            cb();
                        });
                    }
                ], done);

            });
        });
    });

    describe('transactions', function () {
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
                // create a default billing address
                forte.addresses.create({
                    customer_token: customerToken,
                    first_name: 'Emmet',
                    last_name: 'Brown',
                    address_type: 'both',
                    phone: '8005553333',
                    email: 'none@mailsac.com'
                }, function (err, body) {
                    should.not.exist(err);
                    // create a default pay method
                    forte.paymethods.create({
                        customer_token: customerToken,
                        "echeck":{
                           "account_holder": "Emmet Brown",
                           "account_number": "1111111111111",
                           "routing_number": "021000021",
                           "account_type": "Checking" // or savings
                        }
                    }, done);
                });
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

        it('is created ad hoc with no customer', function (done) {
            forte.transactions.create({
               "action":"sale",
               "authorization_amount": 39.00,
               "billing_address":{
                  "first_name": "Emmett",
                  "last_name": "Brown"
               },
               "paymethod":{
                  "echeck":{
                     "account_number": "1111111111111",
                     "routing_number": "021000021"
                  }
                }
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        it('throws error when customer is supplied with echeck', function (done) {
            forte.transactions.create({
                customer_token: customerToken,
               "action":"sale",
               "authorization_amount": 100.00,
               "paymethod":{
                  "echeck":{
                     "account_number": "1111111111111",
                     "routing_number": "021000021"
                  }
                }
            }, function (err, body) {
                should.exist(err);
                done();
            });
        });

        it.only('is created when customer is supplied', function (done) {
            forte.transactions.create({
                customer_token: customerToken,
               "action":"sale",
               "authorization_amount": 14.00,
               "paymethod":{
                  "echeck":{
                     "account_number": "1111111111111",
                     "routing_number": "021000021"
                  }
                }
            }, function (err, body) {
                should.not.exist(err);
                done();
            });
        });

        describe('action methods using existing paymethod', function (done) {

            var paymethod_token;

            it('creates sale', function () {

            });

            it('creates disbursement', function () {

            });
        });

    });
});
