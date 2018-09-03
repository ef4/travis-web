/* eslint-env node */
const { Webpack } = require('ember-webpack');

let w = new Webpack(
  __dirname + '/vanilla-dist',
  __dirname + '/dist',
  templateCompiler,
  consoleWrite(msg) {
    console.log(msg);
  }
});

w.build();
