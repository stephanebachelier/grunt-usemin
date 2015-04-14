'use strict';
var assert = require('assert');
var helpers = require('./helpers');
var Flow = require('../lib/flow.js');

describe('ConfigWriter', function () {
  before(helpers.directory('temp'));

  it('should allow steps per block type', function () {
    var flow = new Flow({
      steps: {
        js: ['bar', 'baz'],
        css: ['foo']
      }
    });
    assert.deepEqual(flow.steps('js'), ['bar', 'baz']);
    assert.deepEqual(flow.steps('css'), ['foo']);
  });

  it('should be able to return post-processors per block type', function () {
    var flow = new Flow({
      post: {
        js: ['bar', 'baz'],
        css: ['foo']
      }
    });
    assert.deepEqual(flow.post('js'), ['bar', 'baz']);
    assert.deepEqual(flow.post('css'), ['foo']);
  });

  it('should return all block types', function () {
    var flow = new Flow({
      steps: {
        js: ['bar', 'baz'],
        css: ['foo']
      },
      post: {
        html: ['bar']
      }
    });
    assert.deepEqual(flow.blockTypes(), ['js', 'css', 'html']);
  });

  it('should return an empty array if no steps are existing', function () {
    var flow = new Flow({
      steps: {},
      post: {
        html: ['bar']
      }
    });
    assert.deepEqual(flow.steps('js'), []);
  });

  it('should return an empty array if no post are existing', function () {
    var flow = new Flow({
      post: {},
      steps: {
        html: ['bar']
      }
    });
    assert.deepEqual(flow.post('js'), []);
  });

  it('should allow to set steps', function () {
    var flow = new Flow({
      steps: {
        html: ['bar']
      }
    });
    flow.setSteps({
      js: ['foo', 'bar']
    });
    assert.deepEqual(flow.steps('js'), ['foo', 'bar']);
  });

  it('should allow to set steps', function () {
    var flow = new Flow({
      post: {
        html: ['bar']
      }
    });
    flow.setPost({
      js: ['foo', 'bar']
    });
    assert.deepEqual(flow.post('js'), ['foo', 'bar']);
  });

  it('should default to empty post', function () {
    // default flow
    var flow = new Flow({
      steps: {
        js: ['concat', 'uglify'],
        css: ['concat', 'cssmin']
      },
      post: {}
    });
    // this might be called if someone define a flow without adding a `post` entry
    flow.setPost();
    assert.deepEqual(flow._post, {});
  });

  it('should be able to merge steps', function () {
    // default flow
    var flow = new Flow({
      steps: {
        js: ['concat', 'uglify'],
        css: ['concat', 'cssmin']
      },
      post: {}
    });
    // this might be called if someone define a flow without adding a `post` entry
    flow.mergeSteps({
      js: ['foo', 'bar']
    });
    assert.deepEqual(flow.steps('js'), ['foo', 'bar']);
    assert.deepEqual(flow.steps('css'), ['concat', 'cssmin']);
  });

  it('should be able to merge steps', function () {
    // default flow
    var flow = new Flow({
      steps: {
        js: ['concat', 'uglify'],
        css: ['concat', 'cssmin']
      },
      post: {}
    });
    // this might be called if someone define a flow without adding a `post` entry
    flow.mergeSteps({
      js: ['uglify']
    });
    assert.deepEqual(flow.steps('js'), ['uglify']);
    assert.deepEqual(flow.steps('css'), ['concat', 'cssmin']);
  });

});

describe('Flow builder from configuration', function () {
  describe('global flow', function () {
    it('should enable removing a step for a type', function () {
      var flow = Flow.getFlowFromConfig({
        html: 'index.html',
        options: {
          flow: {
            steps: {
              js: ['uglify']
            }
          }
        }
      });

      assert.deepEqual(flow.steps('js'), ['uglify']);
      assert.deepEqual(flow.steps('css'), Flow.defaultConfig.steps.css);
    });

    it('should enable clearing all steps for a type', function () {
      var flow = Flow.getFlowFromConfig({
        html: 'index.html',
        options: {
          flow: {
            steps: {
              css: []
            }
          }
        }
      });

      assert.deepEqual(flow.steps('js'), Flow.defaultConfig.steps.js);
      assert.deepEqual(flow.steps('css'), []);
    });
  });

  describe('flow per target', function () {
    it('should enable removing a step for a type', function () {
      var flow = Flow.getFlowFromConfig({
        html: 'index.html',
        options: {
          flow: {
            html: {
              steps: {
                js: ['uglify']
              }
            }
          }
        }
      }, 'html');

      assert.deepEqual(flow.steps('js'), ['uglify']);
      assert.deepEqual(flow.steps('css'), Flow.defaultConfig.steps.css);
    });

    it('should enable clearing all steps for a type', function () {
      var flow = Flow.getFlowFromConfig({
        html: 'index.html',
        options: {
          flow: {
            html: {
              steps: {
                js: ['uglify'],
                css: []
              }
            }
          }
        }
      }, 'html');

      assert.deepEqual(flow.steps('js'), ['uglify']);
      assert.deepEqual(flow.steps('css'), []);
    });
  });
});
