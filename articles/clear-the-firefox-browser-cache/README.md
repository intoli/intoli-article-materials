# How to Clear the Firefox Browser Cache With Selenium WebDriver/geckodriver

[How to Clear the Firefox Browser Cache With Selenium WebDriver/geckodriver](https://intoli.com/blog/clear-the-firefox-browser-cache/) shows how to clear the Firefox site data, including the cache and cookies, with Selenium.
There are two version of the script described in detail in this article.

1. [clear_firefox_61_cache.py](clear_firefox_61_cache.py) - Written for Firefox 61 released on June 26, 2018. The script will keep working until Firefox's slow-changing preferences page is modified by Mozilla.
2. [clear_firefox_57_cache.py](clear_firefox_57_cache.py) - Written for Firefox 57 released on November 14, 2017. The script should work on version of Firefox with a similar preferences page.

The scripts both work in the same way: they visit `about:preferences#privacy` and automate interactions with the interface there to clear the cache.
To use either script, simply use the `clear_firefox_cache()` utility found in either script.
See the [evaluate-clear-cache.py](evaluate-clear-cache.py) script for a complete usage example (it assumes Firefox 61, at least).

You'll need to have `geckodriver` installed on your system (on Linux, this is done by installing it from your package manager) as well as Selenium.
If you're using [clear_firefox_61_cache.py](clear_firefox_61_cache.py), make sure that you have Selenium version v3.14.0 or above installed.
You can install it globablly via `pip` with:

```bash
pip install --user selenium
```

or upgrade your existing version with

```bash
pip install --user -U selenium
```

Then, run the script with

```bash
python evaluate-clear-cache.py
```
