/* eslint-env node */
/* eslint-disable no-console */
const { Webpack } = require('ember-webpack');

let w = new Webpack(
  __dirname + '/vanilla-dist/travis-web',
  __dirname + '/dist',
  function (msg) {
    console.log(msg);
  }
);

w.build();
