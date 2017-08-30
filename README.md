# passport-acuity

[Passport](http://passportjs.org/) strategy for [acuity](https://developers.acuityscheduling.com) authentication.

This module lets you authenticate with Acuity in your Node.js
applications.  By plugging into Passport, Acuity authentication
can be easily and unobtrusively integrated into any application or framework that supports 
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
    $ npm install @nimblr/passport-acuity
```

## Usage

#### Create an Application

Before using `passport-acuity`, you must [register an OAuth2 application](https://acuityscheduling.com/oauth2/register) with Acuity.
Your application will be issued a client ID and a client secret.
These are required in order to authenticate your app with Acuity. You will also need
to register your different redirect URIs authorized for your application. Visit
the [Acuity OAuth2 tutorial](https://developers.acuityscheduling.com/docs/oauth2) for more information.

#### Configure Strategy

The acuity authentication strategy authenticates users using an Acuity account
and OAuth 2.0 tokens. The client ID and secret are obtained when you register your application with Acuity.

The strategy requires a `verify` callback which receives the access token, an optional refresh token,
a profile with the authenticated user information, and a callback.
The `verify` callback must call the passed callback with the user information to complete the authentication process.

```js
    var AcuityOAuth2Strategy = require('@nimblr/passport-acuity-oauth2').Strategy
    
    passport.use(new AcuityOAuth2Strategy({
            clientID: 'abcdefgxs023934',
            clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
            callbackURL: 'https://www.example.net/auth/acuity/callback'
        },
        function(accessToken, credentials, profile, cb) {
            User.findOrCreate(..., function (err, user) {
                done(err, user);
            });
        }
    ));
```
    
The verify callback can be supplied with the `request` object by setting the `passReqToCallback` option to true, and
changing the callback arguments accordingly.

```js
    passport.use(new AcuityOAuth2Strategy({
            clientID: 'abcdefgxs023934',
            clientSecret: 'assdfco09sdXDAdg9cxaaSASDF90asdgf0asdvc',
            callbackURL: 'https://www.example.net/auth/acuity/callback',
            passReqToCallback: true
        },
        function(req, accessToken, credentials, profile, cb) {
            // ...
        }
    ));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'acuity-oauth2'` strategy, to
pass authentication of a request.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
    app.post('/auth/acuity',
      passport.authenticate('acuity-oauth2', { 
        clientID: CLIENT_ID, 
        clientSecret: CLIENT_SECRET, 
        callbackURL: REDIRECT_URI }));
    
    app.post('/auth/acuity/callback', 
      passport.authenticate('acuity-oauth2', { /* credentials */ }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });
```

## Contributing

#### Tests

The test suite is located in the `test/` directory. 

```bash
    $ npm test
```

#### Coverage
All new feature or patch is expected to have test coverage. Patches that increase test coverage are
happily accepted. Coverage reports can be viewed by executing:

```bash
    $ npm run test-cov
    $ npm run view-cov
```

## Credits

  - [Andrés Rodríguez](https://github.com/acrodrig)
  - [David Jiménez](https://github.com/DJphilomath)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Nimblr.ai <[https://nimblr.ai/](https://nimblr.ai/)>
