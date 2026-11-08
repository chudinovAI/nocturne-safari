import {enable, disable, setFetchMethod} from 'darkreader';

// The library uses this for stylesheets and images when browser fetch is available.
setFetchMethod(window.fetch.bind(window));

const defaults = {enabled: true, brightness: 100, disabledHosts: []};
let settings = {...defaults};
const changedDuringLoad = new Set();

function apply() {
  const host = location.hostname.toLowerCase();
  if (!settings.enabled || settings.disabledHosts.includes(host)) {
    disable();
    return;
  }
  enable({brightness: settings.brightness, contrast: 100, sepia: 0});
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const key of Object.keys(defaults)) {
    if (key in changes) {
      settings[key] = changes[key].newValue ?? defaults[key];
      changedDuringLoad.add(key);
    }
  }
  apply();
});

browser.storage.local.get(defaults).then((stored) => {
  // Keep newer changes while still loading untouched settings.
  for (const key of Object.keys(defaults)) {
    if (!changedDuringLoad.has(key)) settings[key] = stored[key];
  }
  apply();
}).catch((error) => console.error('Nocturne: could not load settings', error));
