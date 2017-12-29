#! /usr/bin/env python2

import os
import time

from marionette_driver.marionette import Marionette


# The JavaScript that we want to inject.
# `arguments[0]` is how Selenium passes in the callback for `execute_async_script()`.
injected_javascript = (
    'const time = Date.now();'
    'const callback = arguments[0];'
    'const handleDocumentLoaded = () => {'
    '  document.getElementById("injected-time").innerHTML = time;'
    '  callback();'
    '};'
    'if (document.readyState === "loading") {'
    '  document.addEventListener("DOMContentLoaded", handleDocumentLoaded);'
    '} else {'
    '  handleDocumentLoaded();'
    '}'
)

# The location of the Firefox binary, will depend on system.
# Be careful to use the actual binary and not a wrapper script.
binary = '/usr/lib/firefox/firefox'

# Loop through the four different configurations.
for mode in ['headless', 'graphical']:
    # Set up the client with the appropriate settings.
    if mode == 'headless':
        os.environ['MOZ_HEADLESS'] = '1'
    else:
        os.environ.pop('MOZ_HEADLESS', None)
    client = Marionette('localhost', bin=binary, port=2828)
    client.start_session()


    # Navigate to the test page and inject the JavaScript.
    client.navigate('https://intoli.com/blog/javascript-injection/test-page.html')
    client.execute_async_script(injected_javascript)

    # Save the results as an image.
    filename = os.path.join('img',
        'marionette-execute-async-scripy-firefox-%s-results.png' % mode)
    with open(filename, 'wb') as f:
        f.write(client.screenshot(format='binary'))
    print 'Saved "%s".' % filename

    # Cleanup the client before the next test.
    client.cleanup()
