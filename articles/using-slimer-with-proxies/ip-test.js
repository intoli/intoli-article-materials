/*
 * ip-test.js: Visit https://httpbin.org/ip/ using SlimerJS and print
 * out the reported IP address to the terminal.
 **/
const page = require('webpage').create();

// Note that we're using `https://`.
page.open('https://httpbin.org/ip')
  .then((status) => {
    if (status === 'success') {
      console.log(page.plainText);
    } else {
      console.error('Could not load page.');
    }
    page.close();
    phantom.exit();
  });
