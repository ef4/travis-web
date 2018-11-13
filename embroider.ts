import { App, Workspace } from '@embroider/compat';
import { toBroccoliPlugin } from '@embroider/core';
import { Webpack } from '@embroider/webpack';
import { Tree } from 'broccoli-plugin';
const BroccoliWebpack = toBroccoliPlugin(Webpack);

export default function(emberApp: object, extraPublicTrees: Tree[]) {
  let workspace = new Workspace(emberApp, {
    workspaceDir: '/tmp/vanilla-dist',
    emitNewRoot(root) {
      console.log(`Vanilla app built in ${root}`); // eslint-disable-line no-console
    },
  });

  let embroiderApp = new App(emberApp, workspace, {
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
