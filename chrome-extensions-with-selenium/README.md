# Using Google Chrome Extensions with Selenium

[Using Google Chrome Extensions with Selenium](https://intoli.com/blog/chrome-extensions-with-selenium/) demonstrates how to launch Google Chrome with a custom extension using Python and Selenium.

A custom extension that replaced every webpage that is visited with a "Successfully Installed!" message is used to verify that the extension is loading properly.
This extension is defined in the [extension](extension) subdirectory.

- [extension/manifest.json](extension/manifest.json) - The manifest for the extension.
- [extension/content.js](extension/content.js) - The injected JavaScript.

The actual code for launch Google Chrome with the unpackaged extension installed is in:

- [launch_chrome.py](launch_chrome.py) - A script to launch Chrome with the extension installed and print out the test results.
