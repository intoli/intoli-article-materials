import binascii
import json

from selenium import webdriver
import pytest

from selenium_devtools_protocol import (
    add_script_to_evaluate_on_new_document,
    clear_browser_cookies,
    get_all_cookies,
    print_to_pdf,
    set_extra_http_headers,
    set_script_execution_disabled,
    set_user_agent_override,
)


@pytest.fixture(scope='function')
def driver():
    # Launch a headless Chrome instance using Selenium.
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)

    # Inject the ChromeDriver instance as a fixture.
    yield driver

    # Close the browser after each test.
    driver.quit()


def extract_json(driver):
    """Helper method to extract JSON from a rendered response."""
    return json.loads(driver.find_element_by_tag_name('pre').text)


def test_add_script_to_evaluate_on_new_document(driver):
    source = 'window.scriptRan = true;'
    add_script_to_evaluate_on_new_document(driver, source)

    driver.get('https://google.com')
    script_ran = driver.execute_script('return window.scriptRan;')
    assert script_ran == True


def test_clear_browser_cookies(driver):
    # Set a cookie and then verify that it was set correctly.
    driver.get('https://httpbin.org/cookies/set?test=true')
    driver.get('https://httpbin.org/cookies')
    cookies = extract_json(driver)
    assert cookies['cookies']['test'] == 'true'

    # Navigate to another domain and the clear the cookies.
    driver.get('https://google.com')
    clear_browser_cookies(driver)

    # Verify that the cookie was successfully cleared despite the different domain.
    driver.get('https://httpbin.org/cookies')
    cookies = extract_json(driver)
    assert cookies['cookies'].get('test') is None


def test_get_all_cookies(driver):
    # Set a cookie on the httpbin.org domain.
    driver.get('https://httpbin.org/cookies/set?test=true')

    # Navigate to another domain and retrieve the cookies.
    driver.get('https://google.com')
    cookies = get_all_cookies(driver)

    # Verify the cookie was retrieved despite the different domain.
    found_cookie = False
    for cookie in cookies:
        if 'httpbin.org' not in cookie['domain']:
            continue
        if cookie['name'] == 'test' and cookie['value'] == 'true':
            found_cookie = True
    assert found_cookie


def test_print_to_pdf(driver):
    # Navigate to a website and retrieve the PDF.
    driver.get('https://google.com')
    base64_data = print_to_pdf(driver)
    binary_data = binascii.a2b_base64(base64_data)

    # A little crude, but this roughly verifies that it's a PDF of the right page.
    assert b'PDF' in binary_data
    assert b'google' in binary_data


def test_set_extra_http_headers(driver):
    # Specify an extra header to set.
    driver.get('https://google.com')
    set_extra_http_headers(driver, {'My-Header': 'my-value'})

    # Verify that the header was included in the next request.
    driver.get('https://httpbin.org/headers')
    headers = extract_json(driver)
    assert headers['headers']['My-Header'] == 'my-value'


def test_set_script_execution_disabled(driver):
    for disabled in [False, True]:
        # Set the script execution state.
        set_script_execution_disabled(driver, disabled)

        # Inject a script tag in a new page.
        driver.get('https://google.com')
        source = """
            const script = document.createElement('script');
            script.innerHTML =  'window.scriptRan = true;';
            document.head.appendChild(script);
        """
        driver.execute_script(source)

        # Check that the script either ran or didn't run as expected.
        script_ran = driver.execute_script('return window.scriptRan;')
        expected_script_ran = None if disabled else True
        assert script_ran == expected_script_ran


def test_set_user_agent_override(driver):
    # Specify the new user agent.
    set_user_agent_override(driver, 'fake-ua')

    # Verify that the user-agent header is correct.
    driver.get('https://httpbin.org/headers')
    headers = json.loads(driver.find_element_by_tag_name('pre').text)
    assert headers['headers'].get('User-Agent') == 'fake-ua', str(headers)
