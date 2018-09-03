/* eslint-env node */
/* eslint-disable no-console */
const { Webpack } = require('ember-webpack');

let templateCompiler = function () {
  throw new Error('fixme: should be built into v2 app instead');
};

let w = new Webpack(
  __dirname + '/vanilla-dist',
  __dirname + '/dist',
  templateCompiler,
  function (msg) {
    console.log(msg);
  }
);

w.build();
