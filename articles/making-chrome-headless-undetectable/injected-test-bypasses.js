//
// Bypass the Languages Test.
//

// Overwrite the `languages` property to use a custom getter.
Object.defineProperty(navigator, 'languages', {
  get: function() {
    return ['en-US', 'en'];
  },
});


//
// Bypass the Plugins Test.
//

// Overwrite the `plugins` property to use a custom getter.
Object.defineProperty(navigator, 'plugins', {
  get: function() {
    // This just needs to have `length > 0`, but we could mock the plugins too.
    return [1, 2, 3, 4, 5];
  },
});


//
// Bypass the WebGL test.
//

const getParameter = WebGLRenderingContext.getParameter;
WebGLRenderingContext.prototype.getParameter = function(parameter) {
  // UNMASKED_VENDOR_WEBGL
  if (parameter === 37445) {
    return 'Intel Open Source Technology Center';
  }
  // UNMASKED_RENDERER_WEBGL
  if (parameter === 37446) {
    return 'Mesa DRI Intel(R) Ivybridge Mobile ';
  }

  return getParameter(parameter);
};


//
// Bypass the Broken Image Test.
//

['height', 'width'].forEach(property => {
  // Store the existing descriptor.
  const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, property);

  // Redefine the property with a patched descriptor.
  Object.defineProperty(HTMLImageElement.prototype, property, {
    ...imageDescriptor,
    get: function() {
      // Return an arbitrary non-zero dimension if the image failed to load.
      if (this.complete && this.naturalHeight == 0) {
        return 20;
      }
      // Otherwise, return the actual dimension.
      return imageDescriptor.get.apply(this);
    },
  });
});


//
// Bypass the Retina/HiDPI Hairline Feature Test.
//

// Store the existing descriptor.
const elementDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

// Redefine the property with a patched descriptor.
Object.defineProperty(HTMLDivElement.prototype, 'offsetHeight', {
  ...elementDescriptor,
  get: function() {
    if (this.id === 'modernizr') {
        return 1;
    }
    return elementDescriptor.get.apply(this);
  },
});
