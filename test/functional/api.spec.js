'use strict';
var should = require('should');
var Forte = require('../../index');
var forte;

describe('functional', function () {
    beforeEach(function () {
        forte = new Forte();
        forte.setDevmode();
        forte.setAuthHeader('asdf');
        forte.setBasicAuth('username', 'password');
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
