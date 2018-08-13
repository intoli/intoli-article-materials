from selenium.webdriver.common.alert import Alert
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


dialog_selector = '#dialogOverlay-0 > groupbox:nth-child(1) > browser:nth-child(2)'

accept_dialog_script = (
    f"const browser = document.querySelector('{dialog_selector}');" +
    "browser.contentDocument.documentElement.querySelector('#clearButton').click();"
)


def get_clear_site_data_button(driver):
    return driver.find_element_by_css_selector('#clearSiteDataButton')


def get_clear_site_data_dialog(driver):
    return driver.find_element_by_css_selector(dialog_selector)


def get_clear_site_data_confirmation_button(driver):
    return driver.find_element_by_css_selector('#clearButton')


def clear_firefox_cache(driver, timeout=10):
    driver.get('about:preferences#privacy')
    wait = WebDriverWait(driver, timeout)

    # Click the "Clear Data..." button under "Cookies and Site Data".
    wait.until(get_clear_site_data_button)
    get_clear_site_data_button(driver).click()

    # Accept the "Clear Data" dialog by clicking on the "Clear" button.
    wait.until(get_clear_site_data_dialog)
    driver.execute_script(accept_dialog_script)

    # Accept the confirmation alert.
    wait.until(EC.alert_is_present())
    alert = Alert(driver)
    alert.accept()
