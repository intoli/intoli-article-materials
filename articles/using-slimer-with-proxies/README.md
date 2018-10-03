# Using SlimerJS and Firefox with HTTP Proxies

This directory contains the supporting materials for the [Using SlimerJS and Firefox with HTTP Proxies article](https://intoli.com/blog/using-slimer-with-proxies/) published on the [Intoli blog](https://intoli.com/blog/).
The article explains how to visit a webpage, [https://httpbin.org/ip](https://httpbin.org/ip), thorugh SlimerJS connected to a HTTP proxy secured with HTTP Basic Authentication.


# Contents

- [ip-test.js](ip-test.js) - A SlimerJS script that visits [https://httpbin.org/ip](https://httpbin.org/ip) and prints out the page text.
- [set-up-profile.sh](set-up-profile.sh) - A bash script which creates a new Firefox profile for SlimerJS and adds the Intoli Root CA to it.


# Quick Start

To get started, [sign up for Intoli Smart Proxies](https://intoli.com/proxy/signup/) which we'll use as the example proxy.
Then, note down your initial project's public key and private key.
In this example I'll use fake keys and leave the appropriate substitutions to you.

```bash
export PUBLIC_KEY=d74082e784afca9f
export PRIVATE_KEY=3ac854f5fda7ad74
```

Clone this repo, navigate to this folder, and install SlimerJS.

```bash
https://github.com/intoli/intoli-article-materials
cd intoli-article-materials/articles/using-slimer-with-proxies
yarn install
```

Create a new Firefox profile called `scraping` and install the Intoli Root CA into its certificate database.

```bash
bash ./set-up-profile.sh
```

Finally, visit a HTTPS website using the HTTP Basic Authentication secured proxy.

```bash
./node_modules/.bin/slimerjs ip-test.js \
    -P scraping \
    --headless \
    --proxy=proxy.intoli.com \
    --proxy-auth=$PUBLIC_KEY:$PRIVATE_KEY \
    --proxy-type=http
```
