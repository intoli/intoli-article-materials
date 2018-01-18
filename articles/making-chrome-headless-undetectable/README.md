# Making Chrome Headless Undetectable

[Making Chrome Headless Undetectable](https://intoli.com/blog/making-chrome-headless-undetectable/) is a response to a set of JavaScript based tests that were floating around the internet as a way to block users of headless browser.
It shows that these tests have high false positive rates and can be easily bypassed.

The tests were implemented as a web page that displays the results in a visual table.
The code for the tests are located in:

- [chrome-headless-test.html](chrome-headless-test.html) - The page that defines the results table and imports the test script.
- [chrome-headless-test.js](chrome-headless-test.js) - The associated JavaScript that performs the actual tests and populates the table.

The tests are then bypasses by injecting JavaScript into the page before it loads.

- [injected-test-bypasses.js](injected-test-bypasses.js) - The test bypasses that are developed in the article.
- [inject.py](inject.py) - A [mitmproxy](https://mitmproxy.org/) script for injecting `injected-test-bypasses.js`.
- [test-headless.js](test-headless.js) - A browser automation script written using the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) which visits the test page and records a screenshot of the results.

Details for running the proxy and installing the dependencies can be found in [the original article](https://intoli.com/blog/making-chrome-headless-undetectable/).
