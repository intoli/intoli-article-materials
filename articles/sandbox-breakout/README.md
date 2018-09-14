# Breaking Out of the Chrome/WebExtension Sandbox

[Breaking Out of the Chrome/WebExtension Sandbox](https://intoli.com/blog/sandbox-breakout/) is a guide to breaking out of the content script context of a browser extension so that you can interact with the page context directly.
There are three supplemental materials for the article that are included here:

- [language-test.html](language-test.html) - A simple test page that populates a header element with the current value of `window.navigator`.
- [extension/manifest.json](extension/manifest.json) - The manifest for the extension that overwrites the `window.navigator` property.
- [extension/sandbox-breakout.js](extension/sandbox-breakout.js]) - The implementation of the code which breaks out of the sandbox and overwrites `window.navigator`.

A Chrome browser instance can be launched to run the tests with the following command.

```bash
google-chrome --load-extension=./extension/ language-test.html
```

If the sandbox breakout works as expected, this should open a webpage that displays the text `xx-XX`.
You can see the [original article](https://intoli.com/blog/sandbox-breakout/) for details about how things work.


## The runInPageContext() Method

This is defined in [extension/sandbox-breakout.js](extension/sandbox-breakout.js]), but the portion of code that you're most likely interested in is this.

```javascript
// Breaks out of the content script context by injecting a specially
// constructed script tag and injecting it into the page.
const runInPageContext = (method, ...args) => {
  // The stringified method which will be parsed as a function object.
  const stringifiedMethod = method instanceof Function
    ? method.toString()
    : `() => { ${method} }`;

  // The stringified arguments for the method as JS code that will reconstruct the array.
  const stringifiedArgs = JSON.stringify(args);

  // The full content of the script tag.
  const scriptContent = `
    // Parse and run the method with its arguments.
    (${stringifiedMethod})(...${stringifiedArgs});

    // Remove the script element to cover our tracks.
    document.currentScript.parentElement
      .removeChild(document.currentScript);
  `;

  // Create a script tag and inject it into the document.
  const scriptElement = document.createElement('script');
  scriptElement.innerHTML = scriptContent;
  document.documentElement.prepend(scriptElement);
};
```

This function can be called from an extension's content script context in order to evaluate JavaScript code in the corresponding page context.
The first argument can be either a string containing JavaScript code or a function object.
If it is a function object, then any additional arguments will be passed to the function when it is evaluated.
