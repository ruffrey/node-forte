var should = require('should');
var forte = require('../index');

describe('API', function () {
    it('has expected properties and methods', function () {
        forte.request.should.be.type('function');
        forte.ping.should.be.type('function');
        forte.setDevmode.should.be.type('function');
        forte.base.should.be.type('string');
    });
});
