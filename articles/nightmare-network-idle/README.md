# Implementing a Custom Waiting Action in Nightmare JS

This directory contains a custom [Nightmare](http://www.nightmarejs.org/) action defined in [waitUntilNetworkIdle.js](waitUntilNetworkIdle.js) which waits until there has been no incoming responses for a given amount of time.
The script's implementation details are described in the [Implementing a Custom Waiting Action in Nightmare JS](https://intoli.com/blog/nightmare-network-idle/) article published on the [Intoli blog](https://intoli.com/blog/).

To run the script, you need to have [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/en/) installed.
With that out of the way, download the contents of this directory to disk.

```bash
git clone https://github.com/Intoli/intoli-article-materials.git
cd intoli-article-materials/articles/nightmare-network-idle
```

Then install the dependencies with

```bash
yarn install
```

The mocha test script [test.js](test.js) runs the custom action a few times.
Run the test with

```bash
yarn run test
```
