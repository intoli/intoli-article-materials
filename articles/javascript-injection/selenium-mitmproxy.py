import os

from selenium import webdriver


# The proxy settings.
proxy_host = 'localhost'
proxy_port = 8080

# Loop through the four different configurations.
for browser in ['chrome', 'firefox']:
    for mode in ['headless', 'graphical']:
        # Set up the driver with the appropriate settings.
        if browser == 'chrome':
            # Enable headless mode.
            options = webdriver.ChromeOptions()
            if mode == 'headless':
                options.add_argument('--headless')

            # Specify the proxy.
            options.add_argument('--proxy-server=%s:%s' % (proxy_host, proxy_port))

            # Launch Chrome.
            driver = webdriver.Chrome(chrome_options=options)

        elif browser == 'firefox':
            # Enable headless mode.
            if mode == 'headless':
                os.environ['MOZ_HEADLESS'] = '1'
            elif mode == 'graphical':
                os.environ.pop('MOZ_HEADLESS', None)

            firefox_profile = webdriver.FirefoxProfile()
            # Specify to use manual proxy configuration.
            firefox_profile.set_preference('network.proxy.type', 1)
            # Set the host/port.
            firefox_profile.set_preference('network.proxy.http', proxy_host)
            firefox_profile.set_preference('network.proxy.https_port', proxy_port)
            firefox_profile.set_preference('network.proxy.ssl', proxy_host)
            firefox_profile.set_preference('network.proxy.ssl_port', proxy_port)

            # Launch Firefox.
            driver = webdriver.Firefox(firefox_profile=firefox_profile)

        # Navigate to the test page and inject the JavaScript.
        driver.get('https://intoli.com/blog/javascript-injection/test-page.html')

        # Save the results as an image.
        os.makedirs('img', exist_ok=True)
        filename = os.path.join('img',
            f'selenium-mitmproxy-{browser}-{mode}-results.png')
        driver.get_screenshot_as_file(filename)
        print(f'Saved "{filename}".')

        # Cleanup the driver before the next test.
        driver.quit()
