import json
import os
import sys

from selenium import webdriver
from selenium.webdriver.firefox.firefox_profile import AddonFormatError


# This must be the developer edition to use an unsigned extension.
firefox_binary = '/usr/bin/firefox-developer-edition'
extension_directory = 'extension'


# Patch in support for WebExtensions in Firefox.
# See: https://intoli.com/blog/firefox-extensions-with-selenium/
class FirefoxProfileWithWebExtensionSupport(webdriver.FirefoxProfile):
    def _addon_details(self, addon_path):
        try:
            return super()._addon_details(addon_path)
        except AddonFormatError:
            try:
                with open(os.path.join(addon_path, 'manifest.json'), 'r') as f:
                    manifest = json.load(f)
                    return {
                        'id': manifest['applications']['gecko']['id'],
                        'version': manifest['version'],
                        'name': manifest['name'],
                        'unpack': False,
                    }
            except (IOError, KeyError) as e:
                raise AddonFormatError(str(e), sys.exc_info()[2])
webdriver.FirefoxProfile = FirefoxProfileWithWebExtensionSupport


# Loop through the four different configurations.
for browser in ['chrome', 'firefox']:
    for mode in ['headless', 'graphical']:
        # Set up the driver with the appropriate settings.
        if browser == 'chrome':
            options = webdriver.ChromeOptions()
            if mode == 'headless':
                options.add_argument('headless')
            options.add_argument(f'load-extension={extension_directory}')
            driver = webdriver.Chrome(chrome_options=options)
        elif browser == 'firefox':
            if mode == 'headless':
                os.environ['MOZ_HEADLESS'] = '1'
            elif mode == 'graphical':
                os.environ.pop('MOZ_HEADLESS', None)
            profile = webdriver.FirefoxProfile()
            profile.add_extension(extension_directory)
            driver = webdriver.Firefox(profile, firefox_binary=firefox_binary)

        # Navigate to the test page and let the extension do its thing.
        driver.get('https://intoli.com/blog/javascript-injection/test-page.html')

        # Save the results as an image.
        os.makedirs('img', exist_ok=True)
        filename = os.path.join('img',
            f'selenium-custom-web-extension-{browser}-{mode}-results.png')
        driver.get_screenshot_as_file(filename)
        print(f'Saved "{filename}".')

        # Cleanup the driver before the next test.
        driver.quit()
