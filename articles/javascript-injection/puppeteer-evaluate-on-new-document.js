const puppeteer = require('puppeteer');

const runTest = async (mode) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: mode === 'headless',
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    const time = Date.now();
    const handleDocumentLoaded = () => {
      document.getElementById("injected-time").innerHTML = time;
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", handleDocumentLoaded);
    } else {
      handleDocumentLoaded();
    }
  });
  await page.goto('https://intoli.com/blog/javascript-injection/test-page.html');
  const filename = `img/puppeteer-evaluate-on-new-document-chrome-${mode}.png`;
  await page.screenshot({ path: filename });
  console.log(`Saved "${filename}".`);

  await browser.close();
};

(async () => {
  await runTest('headless');
  await runTest('graphical');
})();
