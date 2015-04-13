'use strict';
var assert = require('assert');
var concatConfig = require('../lib/config/cssmin.js');
var path = require('path');
var helpers = require('./helpers');

var block = {
  type: 'css',
  dest: 'css/main.css',
  src: [
    'foo.css',
    'bar.css',
    'baz.css'
  ],
  raw: [
    '    <!-- build:css css/main.css -->',
    '    <link href="foo.css">',
    '    <link href="bar.css">',
    '    <link href="baz.css">',
    '    <!-- endbuild -->'
  ]
};

describe('Concat config write', function () {
  it('should exhibit a name', function () {
    assert.equal(concatConfig.name, 'cssmin');
  });

  it('should use the input files correctly', function () {
    var ctx = {
      inDir: '.',
      inFiles: ['foo.css', 'bar.css', 'baz.css'],
      outDir: 'tmp/concat',
      outFiles: [],
      resolveInFile: helpers.mockBlockResolveInFile
    };

    var cfg = concatConfig.createConfig(ctx, block);
    
    assert.ok(cfg.files);
    assert.equal(cfg.files.length, 1);
    var files = cfg.files[0];

    assert.ok(files.src);
    assert.equal(files.dest, path.normalize('tmp/concat/css/main.css'));
    assert.deepEqual(files.src, ['foo.css', 'bar.css', 'baz.css']);
    assert.deepEqual(ctx.outFiles, ['css/main.css']);
  });
});
