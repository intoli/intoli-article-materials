#! /usr/bin/env python

import sys

from selenium import webdriver


# Construct a ChromeOptions instance to configure.
options = webdriver.ChromeOptions()

# Specify that we'll run in headless mode.
options.add_argument('headless')

# Set the window size.
options.add_argument('window-size=1200x600')

# Initialize the driver.
driver = webdriver.Chrome(chrome_options=options)

# Navigate to Facebook.
driver.get('https://facebook.com')

# Wait up to 10 seconds for the elements to become available.
driver.implicitly_wait(10)

# Use CSS selectors to grab the login inputs.
email = driver.find_element_by_css_selector('input[type=email]')
password = driver.find_element_by_css_selector('input[type=password]')
login = driver.find_element_by_css_selector('input[value="Log In"]')

# Parse the command-line options.
if len(sys.argv) == 3:
    email, password = sys.argv[1:]
else:
    print('You probably want to specify your email address and password as arguments.')
    email, password = 'evan@intoli.com', 'hunter2'

# Enter our credentials.
email.send_keys(email)
password.send_keys(password)

# Save a screenshot of the page with our email/password entered.
driver.get_screenshot_as_file('main-page-with-information-entered.png')

# Login.
login.click()

# Navigate to Evan's profile.
driver.get('https://www.facebook.com/profile.php?id=100009447446864')

# Take another screenshot.
driver.get_screenshot_as_file('evans-profile.png')

# Cycle through the posts and print out the authors and content.
posts = driver.find_elements_by_css_selector('#stream_pagelet .fbUserContent')
for post in posts:
    try:
        author = post.find_elements_by_css_selector('a[data-hovercard*=user]')[-1].get_attribute('innerHTML')
        content = post.find_elements_by_css_selector('div.userContent')[-1].get_attribute('innerHTML')
    except IndexError:
        # It's an advertisement.
        pass
    print(f'{author}: "{content}"')
