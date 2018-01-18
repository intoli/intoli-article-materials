// User-Agent Test
const userAgentElement = document.getElementById('user-agent-result');
userAgentElement.innerHTML = navigator.userAgent;
if (/HeadlessChrome/.test(navigator.userAgent)) {
  userAgentElement.classList.add('failed');
}

// Webdriver Test
const webdriverElement = document.getElementById('webdriver-result');
if (navigator.webdriver) {
  webdriverElement.classList.add('failed');
  webdriverElement.innerHTML = 'present (failed)';
}

// Chrome Test
const chromeElement = document.getElementById('chrome-result');
if (!window.chrome) {
  chromeElement.classList.add('failed');
  chromeElement.innerHTML = 'missing (failed)';
}

// Permissions Test
const permissionsElement = document.getElementById('permissions-result');
(async () => {
  const permissionStatus = await navigator.permissions.query({ name: 'notifications' });
  permissionsElement.innerHTML = permissionStatus.state;
  if(Notification.permission === 'denied' && permissionStatus.state === 'prompt') {
    permissionsElement.classList.add('failed');
  }
})();

// Plugins Length Test
const pluginsLengthElement = document.getElementById('plugins-length-result');
pluginsLengthElement.innerHTML = navigator.plugins.length;
if (navigator.plugins.length === 0) {
  pluginsLengthElement.classList.add('failed');
}

// Languages Test
const languagesElement = document.getElementById('languages-result');
languagesElement.innerHTML = navigator.languages;
if (!navigator.languages || navigator.languages.length === 0) {
  languagesElement.classList.add('failed');
}
