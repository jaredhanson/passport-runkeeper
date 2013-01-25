/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The RunKeeper authentication strategy authenticates requests by delegating to
 * RunKeeper using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your RunKeeper application's client id
 *   - `clientSecret`  your RunKeeper application's client secret
 *   - `callbackURL`   URL to which RunKeeper will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new RunKeeperStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/runkeeper/callback'
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
  options.authorizationURL = options.authorizationURL || 'https://runkeeper.com/apps/authorize';
  options.tokenURL = options.tokenURL || 'https://runkeeper.com/apps/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'runkeeper';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from RunKeeper.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `runkeeper`
 *   - `id`               the user's RunKeeper ID
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://api.runkeeper.com/user', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'runkeeper' };
      profile.id = json.userID;
      
      // TODO: /profile can be fetched to obtain additional profile details.
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
