const CDP = require('chrome-remote-interface');
const fs = require('fs');

// global settings
const filename = 'headless-results.png';
const url = 'https://intoli.com/blog/making-chrome-headless-undetectable/chrome-headless-test.html';
const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'

CDP(async function(client) {
  const {Network, Page, Security} = client;
  await Page.enable();
  await Network.enable();
  await Network.setUserAgentOverride({userAgent});

  // ignore all certificate errors to support mitmproxy certificates
  await Security.enable();
  await Security.setOverrideCertificateErrors({override: true});
  Security.certificateError(({eventId}) => {
    Security.handleCertificateError({
        eventId,
        action: 'continue'
    });
  });

  // navigate to the page and wait for it to load
  await Page.navigate({url});
  await Page.loadEventFired();

  setTimeout(async function() {
    // save the screenshot
    const screenshot = await Page.captureScreenshot({format: 'png'});
    const buffer = new Buffer(screenshot.data, 'base64');
    fs.writeFile(filename, buffer, 'base64', function(err) {
      if (err) {
        console.error(`Error saving screenshot: ${err}`);
      } else {
        console.log(`"${filename}" written successfully.`);
      }
      client.close();
    });
  }, 1000); // 1 second delay for the tests to complete
}).on('error', err => {
  console.error(`Error connecting to Chrome: ${err}`);
});
