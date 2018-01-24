const Nightmare = require('./waitUntilNetworkIdle.js');
const assert = require('assert');

describe('waitUntilNetworkIdle', function() {
  const waitTimes = [500, 1500, 5000];
  let startTime;
  waitTimes.forEach(function(waitTime) {
    it(`should wait for at least ${waitTime} ms after the last response`,
      function(done) {
        this.timeout(20000);

        const nightmare = new Nightmare({ show: true });
        startTime = Date.now();

        nightmare
          .on('did-get-response-details', () => {
            startTime = Date.now();
          })
          .goto('https://intoli.com/blog/nightmare-network-idle/demo.html')
          .waitUntilNetworkIdle(waitTime)
          .evaluate(() => {
            const body = document.querySelector('body');
            return body.innerText;
          })
          .end()
          .then((result) => {
            const elapsedTime = Date.now() - startTime;

            // Verify the requests completed as expected.
            assert.equal(result, 'All three requests received.');

            // Verify that the action caused Nightmare to wait long enough.
            assert(elapsedTime >= waitTime, 'Wait period too short');

            done();
          })
          .catch(done)
    });
  });
});
