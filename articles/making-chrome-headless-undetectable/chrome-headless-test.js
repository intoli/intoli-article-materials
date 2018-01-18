// User-Agent Test
const userAgentElement = document.getElementById('user-agent');
userAgentElement.innerHTML = window.navigator.userAgent;
if (/HeadlessChrome/.test(window.navigator.userAgent)) {
  userAgentElement.classList.add('failed');
}

// Plugins Length Test
const pluginsLengthElement = document.getElementById('plugins-length');
pluginsLengthElement.innerHTML = navigator.plugins.length;
if (navigator.plugins.length === 0) {
  pluginsLengthElement.classList.add('failed');
}

// Languages Test
const languagesElement = document.getElementById('languages');
languagesElement.innerHTML = navigator.languages;
if (!navigator.languages || navigator.languages.length === 0) {
  languagesElement.classList.add('failed');
}

// WebGL Tests
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('webgl-experimental');
if (gl) {
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

  // WebGL Vendor Test
  const webGLVendorElement = document.getElementById('webgl-vendor');
  const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  webGLVendorElement.innerHTML = vendor;
  if (vendor === 'Brian Paul') {
    webGLVendorElement.classList.add('failed');
  }

  // WebGL Renderer Test
  const webGLRendererElement = document.getElementById('webgl-renderer');
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  webGLRendererElement.innerHTML = renderer;
  if (renderer === 'Mesa OffScreen') {
    webGLRendererElement.classList.add('failed');
  }
}

// Hairline Feature Test
const hairlineFeatureElement = document.getElementById('hairline-feature');
if (Modernizr.hairline) {
  hairlineFeatureElement.innerHTML = 'present';
} else {
  hairlineFeatureElement.innerHTML = 'missing';
  hairlineFeatureElement.classList.add('failed');
}

// Broken Image Dimensions Test
const brokenImageDimensionsElement = document.getElementById('broken-image-dimensions');
const body = document.body;
const image = document.createElement('img');
image.onerror = function(){
  brokenImageDimensionsElement.innerHTML = `${image.width}x${image.height}`;
  if (image.width == 0 && image.height == 0) {
    brokenImageDimensionsElement.classList.add('failed');
  }
};
body.appendChild(image);
image.src = 'https://intoli.com/nonexistent-image.png';
