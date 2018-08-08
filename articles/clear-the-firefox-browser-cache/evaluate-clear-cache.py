from time import sleep
from selenium import webdriver
from clear_firefox_61_cache import clear_firefox_cache

# Visit a website that places data in local storage
driver = webdriver.Firefox()
driver.get('https://overstock.com')

# Navigate to the preferences page to see that the cache is not empty.
driver.get('about:preferences#privacy')
sleep(5)

# Clear the cache and hang around to manually confirm that it worked.
clear_firefox_cache(driver)
sleep(5)

driver.quit()
