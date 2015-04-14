'use strict';
var _ = require('lodash');

//
// Encapsulate definition of a flow's steps, per block types
//
// The flowConfig parameter has the following form:
//
//  {
//    steps: {
//      js: ['bar', 'baz'],
//      css: ['foo']
//     }
//   }
//
var Flow = module.exports = function (flowConfig) {
  this._steps = flowConfig.steps || {};
  this._post = flowConfig.post || {};
};

//
// Returns the steps for the furnished block type
//
Flow.prototype.steps = function (blockType) {
  return this._steps[blockType] || [];
};

//
// Set the steps for the flow
//
Flow.prototype.setSteps = function (steps) {
  // FIXME: Check format !!!
  this._steps = steps;
};

Flow.prototype.mergeSteps = function (steps) {
  // better to use _.defaults than _.merge to not modify existing steps
  // using _.merge would result in adding steps to an existing step array.
  this._steps = _.defaults(steps || {}, this._steps);
};

//
// Returns the postprocessors for the furnished block type
//
Flow.prototype.post = function (blockType) {
  return this._post[blockType] || [];
};

//
// Set the post for the flow
//
Flow.prototype.setPost = function (post) {
  // FIXME: Check format !!!
  this._post = post || {};
};


//
// Returns all referenced block types (i.e. the union of the block types from
// steps and postprocessors)
//
Flow.prototype.blockTypes = function () {
  return _.union(_.keys(this._steps), _.keys(this._post));
};

// Default flow configuration for a target
Flow.defaultConfig = {
  steps: {
    js: ['concat', 'uglify'],
    css: ['concat', 'cssmin']
  },
  post: {}
};

// Retrieve the flow config from the furnished configuration. It can be:
//  - a dedicated one for the furnished target
//  - a general one
//  - the default one
Flow.getFlowFromConfig = function (config, target) {
  var flow = new Flow(Flow.defaultConfig);

  if (config.options && config.options.flow) {
    var flowConfig = config.options.flow[target] ? config.options.flow[target] : config.options.flow;
    flow.mergeSteps(flowConfig.steps);
    flow.setPost(flowConfig.post);
  }

  return flow;
};
