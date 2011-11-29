var vows = require('vows');
var assert = require('assert');
var util = require('util');
var runkeeper = require('passport-runkeeper');


vows.describe('passport-runkeeper').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(runkeeper.version);
    },
  },
  
}).export(module);
