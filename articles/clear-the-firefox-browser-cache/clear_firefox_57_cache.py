from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def get_clear_cache_button(driver):
    return driver.find_element_by_css_selector('#clearCacheButton')


def get_clear_site_data_button(driver):
    return driver.find_element_by_css_selector('#clearSiteDataButton')


def clear_firefox_cache(driver, timeout=10):
    driver.get('about:preferences#privacy')
    wait = WebDriverWait(driver, timeout)

    # Click the "Clear Now" button under "Cached Web Content"
    wait.until(get_clear_cache_button)
    get_clear_cache_button(driver).click()

    # Click the "Clear All Data" button under "Site Data" and accept the alert
    wait.until(get_clear_site_data_button)
    get_clear_site_data_button(driver).click()

    wait.until(EC.alert_is_present())
    alert = Alert(driver)
    alert.accept()
