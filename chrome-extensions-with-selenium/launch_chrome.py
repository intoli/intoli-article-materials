from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


# Configure the necessary command-line option.
options = webdriver.ChromeOptions()
# Note that `chrome-extension` is the path to the unpackaged extension.
options.add_argument('--load-extension=chrome-extension')

# Navigate to any page... well, not just *any* page...
driver = webdriver.Chrome(chrome_options=options)
driver.get('https://intoli.com')

# Check if the extension worked and log the result.
try:
    header = driver.find_element_by_id('successfully-installed')
    print('Success! :-)')
except NoSuchElementException:
    print('Failure! :-(')
finally:
    # Clean up.
    driver.quit()
