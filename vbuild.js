/* eslint-env node */
/* eslint-disable no-console */
const webpack = require('ember-webpack');

let Webpack = webpack({
  // workaround for https://github.com/jeremyfa/yaml.js/issues/102
  node: {
    fs: 'empty'
  }
});

let w = new Webpack(
  // todo: this path depends on the npm linkage structure that we happen to be
  // using. In other words, if you suddenly npm-link an Ember addon into
  // travis-web, and that addon needs to be rewritten to v2, the workspace will
  // accomodate it by creating extra parent dirs above the app.
  //
  // when you do the complete run this doesn't matter, because we thread the
  // proper path through for you. But this standalone script is useful for
  // testing, and it doesn't have a good way to find the app automatically.
  __dirname + '/vanilla-dist',

  __dirname + '/dist',
  function (msg) {
    console.log(msg);
  }
);

w.build();
