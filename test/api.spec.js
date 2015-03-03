'use strict';
var should = require('should');
var Forte = require('../index');
var forte;

describe('API', function () {
    beforeEach(function () {
        forte = new Forte();
        forte.setDevmode();
        forte.setAuthHeader('asdf');
        forte.setBasicAuth('username', 'password');
    });
    
    it.only('supports multiple instances', function () {
        var a = new Forte();
        a.setBasicAuth('user_a', 'pass_b');
        var b = new Forte();
        b.setBasicAuth('user_b', 'pass_b');
        b.setDevmode();
        b._basicAuth.should.not.equal(a._basicAuth);
        a._basicAuth.username.should.equal('user_a');
        b._basicAuth.username.should.equal('user_b');
        b._base.should.not.equal(a._base);
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
    
    it('supports chaining', function () {
        var f = new Forte()
                .setDevmode()
                .setAuthHeader('hh')
                .setBasicAuth('usr', 'pwd');
        f._base.should.equal('https://sandbox.forte.net/api/v1');
        f._authHeader.should.equal('hh');
        f._basicAuth.should.equal({
            username: 'usr',
            password: 'pwd'
        });
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
