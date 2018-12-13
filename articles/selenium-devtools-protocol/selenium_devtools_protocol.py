import binascii


def add_script_to_evaluate_on_new_document(driver, source):
    """Allows specifying JavaScript code to be evaluated upon each page navigation.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.
        source (str): The JavaScript code that will be evaluated in the page context.

    Returns:
        The script identifier string. This can be used with Page.removeScriptToEvaluateOnNewDocument
        in order to remove a script that was previously added.
    """
    result = driver.execute_cdp_cmd(cmd='Page.addScriptToEvaluateOnNewDocument',
                                    cmd_args={'source': source})
    return result['identifier']


def clear_browser_cookies(driver):
    """Clears all cookies across all domains.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.

    Returns:
        None
    """
    return driver.execute_cdp_cmd(cmd='Network.clearBrowserCookies', cmd_args={})


def get_all_cookies(driver):
    """Clears all cookies across all domains.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.

    Returns:
        A list of Cookie dictionaries with fields as documented at:
        https://chromedevtools.github.io/devtools-protocol/tot/Network#type-Cookie
    """
    result = driver.execute_cdp_cmd(cmd='Network.getAllCookies', cmd_args={})
    return result['cookies']


def print_to_pdf(driver, save_as=None, **kwargs):
    """Converts the current page to a PDF, and optionally saves it to disk.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.
        save_as (:obj:`str`, optional): An optional filename where the PDF will be written.
        **kwargs: Optional parameters which control details of the PDF conversion, as documented at:
            https://chromedevtools.github.io/devtools-protocol/tot/Page#method-printToPDF
            Note that these keyword arguments must be specified in camel case.

    Returns:
        A base64 encoded representation of the newly generated PDF file.
    """
    result = driver.execute_cdp_cmd(cmd='Page.printToPDF', cmd_args=kwargs)
    base64_data = result['data']
    if save_as:
        with open(save_as, 'wb') as f:
            binary_data = binascii.a2b_base64(base64_data)
            f.write(binary_data)
    return base64_data


def set_extra_http_headers(driver, headers):
    """Attaches extra HTTP headers to all future requests from the browser.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.
        headers (dict): A map of header names to their corresponding values.

    Returns:
        None
    """
    # Network tracking must be enabled in order for `setExtraHTTPHeaders` to work.
    driver.execute_cdp_cmd(cmd='Network.enable', cmd_args={})
    driver.execute_cdp_cmd(cmd='Network.setExtraHTTPHeaders', cmd_args={'headers': headers})


def set_script_execution_disabled(driver, disabled=True):
    """Allows enabling and disabling JavaScript execution in the browser.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.
        disabled (:obj:`bool`, optional): Indicates whether JavaScript should be disabled.
            Defaults to True.

    Returns:
        None
    """
    driver.execute_cdp_cmd(cmd='Emulation.setScriptExecutionDisabled',
                           cmd_args={'value': disabled})


def set_user_agent_override(driver, user_agent, accept_language=None, platform=None):
    """Attaches extra HTTP headers to all future requests from the browser.

    Args:
        driver (ChromeDriver): The ChromeDriver instance to send the command to.
        user_agent (str): The new user agent string to emulate in the browser.

    Returns:
        None
    """
    cmd_args = {'userAgent': user_agent}
    if accept_language:
        cmd_args['acceptLanguage'] = accept_language
    if platform:
        cmd_args['platform'] = platform
    driver.execute_cdp_cmd(cmd='Network.setUserAgentOverride', cmd_args=cmd_args)
