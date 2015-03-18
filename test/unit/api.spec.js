'use strict';
var should = require('should');
var Forte = require('../../index');
var forte;

describe('Unit tests', function () {
    beforeEach(function () {
        forte = new Forte({
            "apiLoginId": "",
            "secureTransactionKey": "",
            "account_id": "",
            "location_id": ""
        });
        forte.setDevmode();
    });

    it('has expected base properties and methods', function () {
        forte._request.should.be.type('function');
        forte.setDevmode.should.be.type('function');
        forte._base.should.be.type('string');
        forte.location_id.should.be.type('string');
        forte.account_id.should.be.type('string');
    });

    it('supports multiple instances', function () {
        var a = new Forte({
            apiLoginId: 'user_a'
        });
        var b = new Forte({
            apiLoginId: 'user_b'
        });
        b.setDevmode();

        b.basicAuth.username.should.not.equal(a.basicAuth.username);
        a.basicAuth.username.should.equal('user_a');
        b.basicAuth.username.should.equal('user_b');
        b._base.should.not.equal(a._base);
    });

});
