'use strict';
var should = require('should');
var Forte = require('../../index');
var forte;
var credentials = require('../credentials.json');

describe('Functional', function () {
    beforeEach(function () {
        forte = new Forte();
        forte.setDevmode();
        forte.setBasicAuth(credentials.username, credentials.password);
        forte.setAuthHeader('act_200000');
    });
    
    describe('ping', function () {
        it('executes without errors', function (done) {
            forte.ping(function (err, body) {
                should.not.exist(err);
                console.log(body);
                should.exist(body);
                body.should.be.type('object');
                done();
            });
        });
    });
});
