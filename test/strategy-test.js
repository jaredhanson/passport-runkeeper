var vows = require('vows');
var assert = require('assert');
var util = require('util');
var RunKeeperStrategy = require('passport-runkeeper/strategy');


vows.describe('RunKeeperStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new RunKeeperStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named runkeeper': function (strategy) {
      assert.equal(strategy.name, 'runkeeper');
    },
  },
  
  'strategy when loading user profile': {
    topic: function() {
      var strategy = new RunKeeperStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        var body = '{ \
        "userID": 1234567890, \
        "profile": "/profile", \
        "settings": "/settings", \
        "fitness_activities": "/fitnessActivities", \
        "strength_training_activities": "/strengthTrainingActivities", \
        "background_activities": "/backgroundActivities", \
        "sleep": "/sleep", \
        "nutrition": "/nutrition", \
        "weight": "/weight", \
        "general_measurements": "/generalMeasurements", \
        "diabetes": "/diabetes", \
        "records": "/records", \
        "team": "/team" \
        }';
        
        callback(null, body, undefined);
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'runkeeper');
        assert.equal(profile.id, '1234567890');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new RunKeeperStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
      
      // mock
      strategy._oauth2.get = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
        });
      },
      
      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
  
}).export(module);
