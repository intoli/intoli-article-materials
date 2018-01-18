# JavaScript Injection with Selenium, Puppeteer, and Marionette in Chrome and Firefox

[JavaScript Injection with Selenium, Puppeteer, and Marionette in Chrome and Firefox](https://intoli.com/blog/javascript-injection/) benchmarks a variety of JavaScript injection methods to determine whether the injected code executes before or after code in the webpage being visited.

The test itself is defined in:

- [test-page.html](test-page.html) - The page that displays the timing results.

The direct Selenium, Puppeteer, and Marionette tests are defined in:

- [marionette-execute-async-script.py](marionette-execute-async-script.py) - The Marionette test script.
- [puppeteer-evaluate-on-new-document.js](puppeteer-evaluate-on-new-document.js) - The Puppeteer test script.
- [selenium-execute-async-script.py](selenium-execute-async-script.py) - The Selnium test script.

The Web Extension for script injection is then defined in the [extension](extension) subdirectory.

- [./extension/injected-javascript.js](./extension/injected-javascript.js) - The script to be injected.
- [./extension/manifest.json](./extension/manifest.json) - The manifest for the extension.

The script for performing the extension test is then located in:

- [selenium-custom-web-extension.py](selenium-custom-web-extension.py) - Launches Chrome and Firefox with the extension loaded and performs the test.

Finally, there is a test that uses [mitmproxy](https://mitmproxy.org/) to inject a script tag.
This consists of two parts:

- [mitm-injector.py](mitm-injector.py) - The injection script.
- [selenium-mitmproxy.py](selenium-mitmproxy.py) - The test script that goes through the proxy.
