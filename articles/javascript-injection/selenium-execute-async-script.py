import os

from selenium import webdriver


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


# Loop through the four different configurations.
for browser in ['chrome', 'firefox']:
    for mode in ['headless', 'graphical']:
        # Set up the driver with the appropriate settings.
        if browser == 'chrome':
            options = webdriver.ChromeOptions()
            if mode == 'headless':
                options.add_argument('headless')
            driver = webdriver.Chrome(chrome_options=options)
        elif browser == 'firefox':
            if mode == 'headless':
                os.environ['MOZ_HEADLESS'] = '1'
            elif mode == 'graphical':
                os.environ.pop('MOZ_HEADLESS', None)
            driver = webdriver.Firefox()

        # Navigate to the test page and inject the JavaScript.
        driver.get('https://intoli.com/blog/javascript-injection/test-page.html')
        driver.execute_async_script(injected_javascript)

        # Save the results as an image.
        os.makedirs('img', exist_ok=True)
        filename = os.path.join('img',
            f'selenium-execute-async-script-{browser}-{mode}-results.png')
        driver.get_screenshot_as_file(filename)
        print(f'Saved "{filename}".')

        # Cleanup the driver before the next test.
        driver.quit()
