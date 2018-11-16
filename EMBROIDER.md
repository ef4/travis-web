I'm using this fork to test the Embroider build pipeline. How to do it:

1. Get a local build of embroider ready:

```bash
git clone https://github.com/embroider-build/embroider
cd embroider
yarn compile # or yarn compile --watch
for pkg in `ls packages`; do pushd packages/$pkg; yarn link; popd; done
cd ..
```

2. Get our small patch to ember-cli ready locally:
```bash
git clone https://github.com/embroider-build/ember-cli
cd ember-cli
yarn install
yarn link
cd ..
```

3. Get this travis-web fork:
```bash
git clone https://github.com/ef4/travis-web
cd travis-web
git checkout embroider
npm install # not yarn, because traivs-web uses package-lock.json instead
yarn link ember-cli
yarn link @embroider/compat
yarn link @embroider/core
yarn link @embroider/webpack
yarn tsc # this compiles a small TS file that contains our build steps.
         # This could have been JS to avoid this step, but I wanted to
         # verify that the types work here.
```

4. Run it with `ember s` and `ember build`.

Optional build modes via env vars:

- `CLASSIC=true`: runs a normal ember-cli build. This doesn't work at the moment, because travis-web doesn't actually build correctly under the version of ember-cli we have, unrelated to embroider.
- `REUSE_WORKSPACE=true`: after a successful build, you can run with this to keep the prebuilt v2 addons from the last build. This lets you measure the build-time impact if those addons were all natively published as v2.
- `STAGE1_ONLY=true`: set this to stop the build after stage 1, which means it only creates the workspace. The output will _not_ be in `dist`, but the build will print the output location.
- `STAGE2_ONLY=true`: set this to stop the build after stage2, which means we assemble the complete application that is ready to hand off to a final stage packager like webpack. The output will not be in `dist`, but the build will print the output location.

