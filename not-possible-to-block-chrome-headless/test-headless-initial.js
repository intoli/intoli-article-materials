// We'll use Puppeteer is our browser automation framework.
const puppeteer = require('puppeteer');

// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
  // TODO: Not implemented yet.
}

(async () => {
  // Launch the browser in headless mode and set up a page.
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });
  const page = await browser.newPage();

  // Prepare for the tests (not yet implemented).
  await preparePageForTests(page);

  // Navigate to the page that will perform the tests.
  const testUrl = 'https://intoli.com/blog/' +
    'not-possible-to-block-chrome-headless/chrome-headless-test.html';
  await page.goto(testUrl);

  // Save a screenshot of the results.
  await page.screenshot({path: 'headless-initial-results.png'});

  // Clean up.
  await browser.close()
})();
