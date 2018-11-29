import { App, Addons as CompatAddons } from '@embroider/compat';
import { toBroccoliPlugin, PrebuiltAddons } from '@embroider/core';
import { Webpack } from '@embroider/webpack';
import { Tree } from 'broccoli-plugin';
const BroccoliWebpack = toBroccoliPlugin(Webpack);

export default function(emberApp: object, extraPublicTrees: Tree[]) {
  let addons;
  if (process.env.REUSE_WORKSPACE) {
    addons = new PrebuiltAddons(__dirname, '/tmp/vanilla-dist');
  } else {
    addons = new CompatAddons(emberApp, {
      workspaceDir: '/tmp/vanilla-dist',
    });
    addons.ready().then(result => {
      console.log(`Building into ${result.outputPath}`);
    });
  }

  if (process.env.STAGE1_ONLY) {
    return addons;
  }

  let embroiderApp = new App(emberApp, addons, {
    extraPublicTrees,
  });

  if (process.env.STAGE2_ONLY) {
    return embroiderApp.tree;
  }

  return new BroccoliWebpack(embroiderApp, {
    webpackConfig: {
      // workaround for https://github.com/jeremyfa/yaml.js/issues/102
      node: {
        fs: 'empty'
      }
    }
  });
}
