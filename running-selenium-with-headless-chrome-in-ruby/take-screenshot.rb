require "selenium-webdriver"


# Configure the driver to run in headless mode.
options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless')
driver = Selenium::WebDriver.for :chrome, options: options

# Navigate to a really super awesome blog.
driver.navigate.to "https://intoli.com/blog/"

# Resize the window and take a screenshot.
driver.manage.window.resize_to(800, 800)
driver.save_screenshot "intoli-screenshot.png"
