/* eslint-env node */
/* eslint-disable no-console */
const { webpack } = require('ember-webpack');

let Webpack = webpack({
  // workaround for https://github.com/jeremyfa/yaml.js/issues/102
  node: {
    fs: 'empty'
  }
});

let w = new Webpack(
  __dirname + '/vanilla-dist/travis-web',
  __dirname + '/dist',
  function (msg) {
    console.log(msg);
  }
);

w.build();
