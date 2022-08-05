import { automaticKey, improvePerformanceKey, youTubeHostname, allHostname, } from '../util/constants.js';
(async () => {
    const automaticSwitch = document.getElementById(automaticKey);
    const improvePerformanceSwitch = document.getElementById(improvePerformanceKey);
    const keys = await chrome.storage.sync.get([
        automaticKey,
        improvePerformanceKey,
    ]);
    automaticSwitch.checked = keys[automaticKey];
    improvePerformanceSwitch.checked = keys[improvePerformanceKey];
    improvePerformanceSwitch.disabled = automaticSwitch.checked === false;
    automaticSwitch.addEventListener('click', async () => {
        if (automaticSwitch.checked) {
            const granted = await chrome.permissions.request({
                origins: [youTubeHostname],
            });
            if (granted === false) {
                automaticSwitch.checked = false;
                return;
            }
        }
        improvePerformanceSwitch.disabled = automaticSwitch.checked === false;
        await chrome.storage.sync.set({
            [automaticKey]: automaticSwitch.checked,
        });
        const declarativeNetRequestKey = automaticSwitch.checked
            ? 'enableRulesetIds'
            : 'disableRulesetIds';
        await chrome.declarativeNetRequest.updateEnabledRulesets({
            [declarativeNetRequestKey]: ['shorts'],
        });
    });
    improvePerformanceSwitch.addEventListener('click', async () => {
        if (improvePerformanceSwitch.checked) {
            const granted = await chrome.permissions.request({
                origins: [allHostname],
            });
            if (granted === false) {
                improvePerformanceSwitch.checked = false;
                return;
            }
        }
        await chrome.storage.sync.set({
            [improvePerformanceKey]: improvePerformanceSwitch.checked,
        });
    });
})();
