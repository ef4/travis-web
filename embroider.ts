import { App, Workspace as CompatWorkspace } from '@embroider/compat';
import { toBroccoliPlugin, PrebuiltWorkspace } from '@embroider/core';
import { Webpack } from '@embroider/webpack';
import { Tree } from 'broccoli-plugin';
const BroccoliWebpack = toBroccoliPlugin(Webpack);

export default function(emberApp: object, extraPublicTrees: Tree[]) {
  let workspace;
  if (process.env.REUSE_WORKSPACE) {
    workspace = new PrebuiltWorkspace(__dirname, '/tmp/vanilla-dist');
  } else {
    workspace = new CompatWorkspace(emberApp, {
      workspaceDir: '/tmp/vanilla-dist',
      emitNewRoot(root) {
        console.log(`Vanilla app built in ${root}`); // eslint-disable-line no-console
      },
    });
  }

  if (process.env.STAGE1_ONLY) {
    return workspace;
  }

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
