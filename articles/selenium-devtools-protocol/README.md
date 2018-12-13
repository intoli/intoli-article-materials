# How to Use the Chrome DevTools Protocol with Selenium in Python

[How to Use the Chrome DevTools Protocol with Selenium in Python](https://intoli.com/blog/selenium-devtools-protocol) explains how to use the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/tot/) with [Selenium](https://github.com/SeleniumHQ/selenium/) to accomplish things like clearing all cookies, clearing the browser cache, reading all cookies, modifying HTTP headers, printing pages to PDF, disabling JavaScript, and injecting JavaScript before pages load.
All of the methods developed in the article are included here in the [selenium_devtools_protocol.py](selenium_devtools_protocol.py) Python module.
You can feel free to use these in your own projects, but please note that all code in this repository is licensed under a [2-Clause BSD License](../../LICENSE.md) unless otherwise noted.

A second file called [test_selenium_devtool_protocol.py](test_selenium_devtool_protocol.py) can also be found in this directory.
This file includes a suite of tests for each of the methods in the `selenium_devtools_protocol` module.
The tests in this file additionally serve as usage examples for the various DevTools Protocol methods.

To run the test suite yourself, you should first create a [virtualenv](https://virtualenv.pypa.io/en/latest/) and install the dependencies that are listed in [requirements.txt](requirements.txt).

```bash
# Create a local virtualenv in the ./env/ directory.
virtualenv ./env/

# Activate the virtualenv.
. env/bin/activate

# Install the necessary dependencies.
pip install -r requirements.txt
```

Then simply run

```bash
pytest
```

to run the test suite.
Note that the tests run with Chrome in headless mode, so you won't see a browser window while the tests run.
Instead, you should see test outputs which look similar to the following.

```literal
============================= test session starts ==============================
platform linux -- Python 3.7.1, pytest-4.0.1, py-1.7.0, pluggy-0.8.0
rootdir: /tmp/intoli-article-materials/articles/selenium-devtools-protocol, inifile:
collected 7 items

test_selenium_devtools_protocol.py .......                               [100%]

========================== 7 passed in 26.82 seconds ===========================
```
