'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const Funnel = require('broccoli-funnel');
const SVGO = require('svgo');
const { App: VanillaApp } = require('ember-cli-vanilla');
const webpack = require('ember-webpack');

module.exports = function () {
  let fingerprint;

  if (process.env.DISABLE_FINGERPRINTS) {
    fingerprint = false;
  } else {
    fingerprint = {
      exclude: ['images/emoji', 'images/logos'],
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg']
    };

    if (process.env.TRAVIS_ENTERPRISE) {
      fingerprint.prepend = '/';
    } else {
      let assetsHost = process.env.ASSETS_HOST;
      if (assetsHost) {
        if (assetsHost.substr(-1) !== '/') {
          assetsHost = assetsHost + '/';
        }
        fingerprint.prepend = assetsHost;
      } else if (process.env.DEPLOY_TARGET) {
        const s3Bucket = require('./config/deploy')(process.env.DEPLOY_TARGET).s3.bucket;
        fingerprint.prepend = '//' + s3Bucket + '.s3.amazonaws.com/';
      }
    }
  }

  const app = new EmberApp({
    'ember-cli-babel': {
      includePolyfill: true,
    },
    autoImport: {
      webpack: {
        // workaround for https://github.com/jeremyfa/yaml.js/issues/102
        node: {
          fs: 'empty'
        }
      }
    },
    babel: {
      blacklist: ['regenerator'],
      plugins: [
        'transform-decorators-legacy',
        'transform-class-properties',
      ]
    },
    fingerprint: fingerprint,
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    'ember-prism': {
      'components': ['scss', 'javascript', 'json'], // needs to be an array, or undefined.
      'plugins': ['line-highlight']
    },
    svg: {
      optimize: false,
      paths: [
        'public/images/stroke-icons',
        'public/images/svg'
      ]
    },
    svgJar: {
      optimizer: {
        svgoModule: SVGO,
        plugins: [
          { removeViewBox: false },
          { removeTitle: false },
          { removeDesc: false },
          {
            inlineStyles: {
              onlyMatchedOnce: false,
              removeMatchedSelectors: true
            }
          }
        ]
      }
    }
  });

  app.import('node_modules/timeago/jquery.timeago.js');

  const emojiAssets = new Funnel('node_modules/emoji-datasource-apple/img/apple/64', {
    destDir: '/images/emoji'
  });

  let vanillaApp = new VanillaApp(app.project.root, {
    workspaceDir: 'vanilla-dist',
    legacyAppInstance: app,
    extraPublicTrees: [emojiAssets],
    emitNewRoot(root) {
      console.log(`Vanilla app built in ${root}`); // eslint-disable-line no-console
    }
  });

  if (process.env.FULL) {
    return vanillaApp.packageWith(webpack({
      // workaround for https://github.com/jeremyfa/yaml.js/issues/102
      node: {
        fs: 'empty'
      }
    }));
  } else {
    return vanillaApp.vanillaTree;
  }
};
