// Overwrite the `navigator.language` property to return a custom value.
const overwriteLanguage = (language) => {
  Object.defineProperty(navigator, 'language', {
    get: () => language,
  });
};


// Breaks out of the content script context by injecting a specially
// constructed script tag and injecting it into the page.
const runInPageContext = (method, ...args) => {
  // The stringified method which will be parsed as a function object.
  const stringifiedMethod = method instanceof Function
    ? method.toString()
    : `() => { ${method} }`;

  // The stringified arguments for the method, reconstructed into a spread array.
  const stringifiedArgs = `JSON.parse(${JSON.stringify(JSON.stringify(args))})`;

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


// This won't work, it's sandboxed from the page context.
overwriteLanguage('xx-XX');

// This will work, it breaks out of the sandbox.
runInPageContext(overwriteLanguage, 'xx-XX');
