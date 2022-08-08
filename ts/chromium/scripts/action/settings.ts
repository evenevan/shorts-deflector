import {
    automaticStorageKey,
    improvePerformanceStorageKey,
    youTubeHostname,
    allHostname,
    automaticHTMLKey,
    improvePerformanceHTMLKey,
} from '../util/constants.js';

(async () => {
    const automaticSwitch = document.getElementById(
        automaticHTMLKey,
    ) as HTMLInputElement;

    const improvePerformanceSwitch = document.getElementById(
        improvePerformanceHTMLKey,
    ) as HTMLInputElement;

    const storageKeys = await chrome.storage.sync.get([
        automaticStorageKey,
        improvePerformanceStorageKey,
    ]);

    automaticSwitch.checked = storageKeys[automaticStorageKey];
    improvePerformanceSwitch.checked = storageKeys[improvePerformanceStorageKey];
    improvePerformanceSwitch.disabled = automaticSwitch.checked === false;

    automaticSwitch.addEventListener('click', async () => {
        if (automaticSwitch.checked) {
            const granted = await chrome.permissions.request({
                origins: [youTubeHostname],
            }) as unknown as boolean;

            if (granted === false) {
                automaticSwitch.checked = false;

                return;
            }
        }

        improvePerformanceSwitch.disabled = automaticSwitch.checked === false;

        await chrome.storage.sync.set({
            [automaticStorageKey]: automaticSwitch.checked,
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
            }) as unknown as boolean;

            if (granted === false) {
                improvePerformanceSwitch.checked = false;

                return;
            }
        }

        await chrome.storage.sync.set({
            [improvePerformanceStorageKey]: improvePerformanceSwitch.checked,
        });
    });
})();