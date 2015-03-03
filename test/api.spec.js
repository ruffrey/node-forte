'use strict';
var should = require('should');
var Forte = require('../index');
var forte

describe('API', function () {
    beforeEach(function () {
        forte = new Forte();
        forte.setDevmode();
        forte.setAuthHeader('asdf');
        forte.setBasicAuth('username', 'password');
    });
    
    it('has expected properties and methods', function () {
        forte.request.should.be.type('function');
        forte.ping.should.be.type('function');
        forte.setDevmode.should.be.type('function');
        forte.setAuthHeader.should.be.type('function');
        forte.setBasicAuth.should.be.type('function');
        forte._base.should.be.type('string');
        forte._authHeader.should.be.type('string');
    });
    
    describe('setAuthHeader', function () {
        it('should work', function () {
            forte.setAuthHeader('asdfjkl');
            forte._authHeader.should.equal('asdfjkl');
        });
    });
    
    describe('setBasicAuth', function () {
        it('should work', function () {
            forte.setBasicAuth('username', 'password');
            forte._basicAuth.should.be.type('object');
            forte._basicAuth.username.should.equal('username');
            forte._basicAuth.password.should.equal('password');
        });
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
