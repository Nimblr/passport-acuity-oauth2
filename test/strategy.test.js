/* global describe, it, expect, beforeEach, afterEach */
/* jshint expr: true */

var Strategy = require('../lib/strategy')
    , chai = require('chai')
    , sinon = require('sinon');

chai.use(require('chai-passport-strategy'));
global.expect = chai.expect;

describe('AcuityOAuth2Strategy', function() {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('constructed', function () {
        describe('with normal options', function() {
            var strategy = new Strategy({
                clientID: 'abcdefgxs023934',
                clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
                callbackURL: 'https://www.example.net/auth/acuity/callback'
            }, function(){});

            it('should be named acuity', function () {
                expect(strategy.name).to.equal('acuity');
            });

            it('should store the client id, secret and callback url', function () {
                expect(strategy._clientID).to.equal('abcdefgxs023934');
                expect(strategy._clientSecret).to.equal('assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc');
                expect(strategy._callbackURL).to.equal('https://www.example.net/auth/acuity/callback');
            });
        }); // with normal options

        describe('without a verify callback', function () {
            it('should throw', function () {
                expect(function () {
                    new Strategy({
                        clientID: 'abcdefgxs023934',
                        clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
                        callbackURL: 'https://www.example.net/auth/acuity/callback'
                    });
                }).to.throw(TypeError, 'AcuityOAuth2Strategy requires a verify callback');
            });
        }); // without a verify callback

        describe('without a clientID option', function () {
            it('should throw', function () {
                expect(function () {
                    new Strategy({
                        clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
                        callbackURL: 'https://www.example.net/auth/acuity/callback'
                    }, function () {});
                }).to.throw(TypeError, 'AcuityOAuth2Strategy requires a clientID option');
            });
        }); // without an clientID

        describe('without a clientSecret option', function () {
            it('should throw', function () {
                expect(function () {
                    new Strategy({
                        clientID: 'abcdefgxs023934',
                        callbackURL: 'https://www.example.net/auth/acuity/callback'
                    }, function () {});
                }).to.throw(TypeError, 'AcuityOAuth2Strategy requires a clientSecret option');
            });
        }); // without an clientSecret

        describe('without a callbackURL option', function () {
            it('should throw', function () {
                expect(function () {
                    new Strategy({
                        clientID: 'abcdefgxs023934',
                        clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc'
                    }, function () {});
                }).to.throw(TypeError, 'AcuityOAuth2Strategy requires a callbackURL option');
            });
        }); // without an callbackURL
    });

});

