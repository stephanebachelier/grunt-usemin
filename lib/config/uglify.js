'use strict';

var path = require('path');

exports.name = 'uglify';

//
// Output a config for the furnished block
// The context variable is used both to take the files to be treated
// (inFiles) and to output the one(s) created (outFiles).
// It also conveys whether or not the current process is the last of the pipe
//
exports.createConfig = function (context, block) {
  var cfg = {
    files: []
  };
  context.outFiles = [];

  // Depending whether or not we're the last of the step we're not going to output the same thing:
  // if we're the last one we must use the block dest file name for output
  // otherwise uglify each input file into its given outputfile
  if (context.last === true) {
    var files = {
      dest: path.join(context.outDir, block.dest),
      src: context.inFiles.map(context.resolveInFile, context)
    };
    cfg.files.push(files);
    context.outFiles.push(block.dest);
  } else {
    context.inFiles.forEach(function (fname) {
      cfg.files.push({
        src: [context.resolveInFile(fname)],
        dest: path.join(context.outDir, fname)
      });
      // cfg[outfile] = [file];
      context.outFiles.push(fname);
    });
  }
  return cfg;
};
