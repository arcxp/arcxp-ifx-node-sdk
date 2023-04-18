# Developing the SDK Locally
If you need to test changes to this SDK you can easily do so by using the [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) command. 

1. `git checkout` this repo locally, `cd` into it and then type `npm link`. This will create a symlink in your global node modules file (which you can find with ` npm root -g`).
2. `git checkout` the root directory of your integration that imports this SDK and then type `npm link @arcxp/arcxp-ifx-node-sdk`. This will tell npm that for your integration only it should utilize the symlinked version from your global node modules instead of the version specified in your package.json.

And that's it! No need to run `npm install` or anything, you are now already using a local version of the SDK. Any changes are immediately reflected.

When you want to go back to an official version of the SDK, you can just run `npm unlink --no-save @arcxp/arcxp-ifx-node-sdk` in the root directory of your integration.

(If you forget this `--no-save` option when unlinking, it will remove the dependency from your package.json entirely which is not what we want.)
