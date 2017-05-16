"use strict";

const OAuth2Strategy = require("passport-oauth2").Strategy;
const InternalOAuthError = require("passport-oauth2").InternalOAuthError;
const util = require("util");

// See https://github.com/thegameofcode/passport-fitbit-oauth2

/**
 * `Strategy` constructor.
 *
 * The Fitbit authentication strategy authenticates requests by delegating to
 * Fitbit using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Fitbit application's client id
 *   - `clientSecret`  your Fitbit application's client secret
 *   - `callbackURL`   URL to which Fitbit will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new FitbitStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/fitbit/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    /*
    options.authorizationURL = options.authorizationURL || 'https://www.fitbit.com/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://api.fitbit.com/oauth2/token';
    options.scopeSeparator = options.scopeSeparator || ' ';
    options.customHeaders = {
        Authorization:  'Basic '+ new Buffer(options.clientID + ':' + options.clientSecret).toString('base64')
    };
    */

    OAuth2Strategy.call(this, options, verify);
    this.name = "acuity";
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authenticate = function(req, options) {
    options || (options = {});

    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
 * Retrieve user profile from Fitbit.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `fitbit`
 *   - `id`
 *   - `name`
 *   - `displayName`
 *   - `birthday`
 *   - `relationship`
 *   - `isPerson`
 *   - `isPlusUser`
 *   - `placesLived`
 *   - `language`
 *   - `emails`
 *   - `gender`
 *   - `picture`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {

    this._oauth2.useAuthorizationHeaderforGET(true);
    this._oauth2.get("https://acuityscheduling.com/api/v1/me", accessToken, function (err, body, res) {
        if (err) { return done(new InternalOAuthError("failed to fetch user profile", err)); }

        // See http://passportjs.org/docs/profile
        try {
            let json = JSON.parse(body);
            let profile = {
                provider: "acuity",
                id: json.id,
                displayName: json.name || "",
                emails: [ { value: json.email } ],
                _json: json
            };
            done(null, profile);
        } catch(ex) { done(ex); }
    });
};

/**
 * Expose `Strategy` directly from package.
 */
exports = module.exports = Strategy;

/**
 * Export constructors.
 */
exports.Strategy = Strategy;