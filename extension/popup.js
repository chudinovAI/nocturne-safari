const defaults = {enabled: true, brightness: 100, disabledHosts: []};
const enabled = document.querySelector('#enabled');
const site = document.querySelector('#site');
const hostLabel = document.querySelector('#host');
const brightness = document.querySelector('#brightness');
const value = document.querySelector('#brightness-value');
const status = document.querySelector('#status');
let host = null;
let disabledHosts = [];

function render(settings) {
  enabled.checked = settings.enabled;
  brightness.value = settings.brightness;
  value.textContent = `${settings.brightness}%`;
  disabledHosts = settings.disabledHosts;
  site.disabled = !host;
  site.checked = !!host && !disabledHosts.includes(host);
}

async function save(changes) {
  try {
    await browser.storage.local.set(changes);
    status.textContent = '';
  } catch (error) {
    status.textContent = 'Could not save settings. Please reopen the extension.';
    console.error(error);
  }
}

async function init() {
  try {
    const [settings, tabs] = await Promise.all([
      browser.storage.local.get(defaults),
      browser.tabs.query({active: true, currentWindow: true})
    ]);
    try {
      const url = new URL(tabs[0]?.url);
      if (url.protocol === 'http:' || url.protocol === 'https:') host = url.hostname.toLowerCase();
    } catch (_) { /* Safari internal pages have no accessible URL. */ }
    hostLabel.textContent = host || 'Unavailable on this page';
    render(settings);
    enabled.addEventListener('change', () => save({enabled: enabled.checked}));
    site.addEventListener('change', () => {
      disabledHosts = disabledHosts.filter((item) => item !== host);
      if (!site.checked) disabledHosts.push(host);
      save({disabledHosts});
    });
    brightness.addEventListener('input', () => {
      value.textContent = `${brightness.value}%`;
    });
    brightness.addEventListener('change', () => save({brightness: Number(brightness.value)}));
    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      if (changes.enabled) enabled.checked = changes.enabled.newValue ?? defaults.enabled;
      if (changes.brightness) {
        brightness.value = changes.brightness.newValue ?? defaults.brightness;
        value.textContent = `${brightness.value}%`;
      }
      if (changes.disabledHosts) {
        disabledHosts = changes.disabledHosts.newValue ?? [];
        site.checked = !!host && !disabledHosts.includes(host);
      }
    });
  } catch (error) {
    hostLabel.textContent = 'Could not load settings';
    status.textContent = 'Please close and reopen the extension.';
    console.error(error);
  }
}
init();
