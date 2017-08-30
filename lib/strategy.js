/**
 * Module dependencies.
 */
var OAuth2Strategy = require('passport-oauth2')
    , util = require('util')
    , debug = require('debug')('passport-acuity-oauth2:strategy')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError
    , Profile = require('./profile');


/**
 * Creates an instance of `AcuityOAuth2Strategy`.
 *
 * The Acuity authentication strategy authenticates requests by delegating
 * to Acuity REST API using  the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback with the following signature
 *
 *     function(accessToken, refreshToken, profile, done)
 *
 * The verify callback is responsible for finding or creating the user,
 * and invoking `done` with the following arguments:
 *
 *     done(err, user, info);
 *
 * If there is an authentication failure, `user` should be set to `false`.
 *
 * Options:
 *   - `clientID`      your Acuity client ID
 *   - `clientSecret`  your Acuity application's client secret
 *   - `callbackURL`   URL to which Windows Live will redirect the user after granting authorization
 *   - `scope`         Acuity scope, following the format given in their API
 *
 * Example:
 *
 *     passport.use(new AcuityOAuth2Strategy({
 *            clientID: 'abcdefgxs023934',
 *            clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
 *            callbackURL: 'https://www.example.net/auth/acuity/callback'
 *        },
 *       function(accessToken, credentials, profile, done) {
 *           User.findOrCreate(..., function (err, user) {
 *               done(err, user);
 *           });
 *        }
 *     ));
 *
 * @constructor
 * @param {Object} options
 * @param {String} options.clientID - your Acuity client ID. It is given by the Acuity support team
 * @param {String} options.clientSecret - your Acuity client secret.
 * @param {String} options.callbackURL - URL to which Acuity will redirect the user after obtaining authorization
 * @param {String} [options.scope] - Acuity scope directive
 * @param {Boolean} [options.passReqToCallback] - if the request object is passed to the verify callback
 * @param {String} [options.authorizationURL] - URL used to obtain an authorization grant
 * @param {String} [options.profileURL] - URL used to obtain the profile information
 * @param {String} [options.tokenURL] - URL used to obtain an access token
 * @param {Function} verify
 * @api public
 */
function AcuityOAuth2Strategy(options, verify) {

    options = options || {};

    // Verify we have basic information. This way if something is missing, the user knows as soon as possible
    if (!verify) { throw new TypeError('AcuityOAuth2Strategy requires a verify callback'); }
    if (!options.clientID) { throw new TypeError('AcuityOAuth2Strategy requires a clientID option'); }
    if (!options.clientSecret) { throw new TypeError('AcuityOAuth2Strategy requires a clientSecret option'); }
    if (!options.callbackURL) { throw new TypeError('AcuityOAuth2Strategy requires a callbackURL option'); }

    // Allow to have custom/updated urls
    options.authorizationURL = options.authorizationURL || 'https://acuityscheduling.com/oauth2/authorize';
    options.tokenURL = options.tokenURL || 'https://acuityscheduling.com/oauth2/token';


    OAuth2Strategy.call(this, options, verify);
    this.name = 'acuity';
    this._verify = verify;
    this._passReqToCallback = options.passReqToCallback;

    this._profileURL = options.profileURL || 'https://acuityscheduling.com/api/v1/me';
    this._clientID = options.clientID;
    this._clientSecret = options.clientSecret;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(AcuityOAuth2Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Acuity.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `acuity`
 *   - `id`
 *   - `username`
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
AcuityOAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    debug('userProfile url: %s', this._profileURL);
    this._oauth2.useAuthorizationHeaderforGET(true);
    this._oauth2.get(this._profileURL, accessToken, function (err, body, res) {
        var json;

        if (err) { debug('userProfile error: %j' + err); }
        if (err) { return done(new InternalOAuthError('Failed to fetch user profile', err)); }

        try {
            debug('userProfile body: %s', body);
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile.parse(json);
        profile.provider = 'acuity';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
};

/**
 * Expose `AcuityOAuth2Strategy`.
 */
module.exports = AcuityOAuth2Strategy;
