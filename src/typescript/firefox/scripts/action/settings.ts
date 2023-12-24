import {
    allHostname,
    automaticHTMLKey,
    automaticStorageKey,
    improvePerformanceHTMLKey,
    improvePerformanceStorageKey,
    shortsRuleset,
    youTubeHostname,
} from '../util/constants.js';

const automaticSwitch = document.getElementById(automaticHTMLKey) as HTMLInputElement;

const improvePerformanceSwitch = document.getElementById(
    improvePerformanceHTMLKey,
) as HTMLInputElement;

const storageKeys = await browser.storage.sync.get([
    automaticStorageKey,
    improvePerformanceStorageKey,
]);

automaticSwitch.checked = storageKeys[automaticStorageKey];
improvePerformanceSwitch.checked = storageKeys[improvePerformanceStorageKey];
improvePerformanceSwitch.disabled = automaticSwitch.checked === false;

automaticSwitch.addEventListener('click', async () => {
    if (automaticSwitch.checked) {
        const granted = (await browser.permissions.request({
            origins: [youTubeHostname],
        })) as unknown as boolean;

        if (granted === false) {
            automaticSwitch.checked = false;

            return;
        }
    }

    improvePerformanceSwitch.disabled = automaticSwitch.checked === false;

    await browser.storage.sync.set({
        [automaticStorageKey]: automaticSwitch.checked,
    });

    const declarativeNetRequestKey = automaticSwitch.checked
        ? 'enableRulesetIds'
        : 'disableRulesetIds';

    await browser.declarativeNetRequest.updateEnabledRulesets({
        [declarativeNetRequestKey]: [shortsRuleset],
    });
});

improvePerformanceSwitch.addEventListener('click', async () => {
    if (improvePerformanceSwitch.checked) {
        const granted = (await browser.permissions.request({
            origins: [allHostname],
        })) as unknown as boolean;

        if (granted === false) {
            improvePerformanceSwitch.checked = false;

            return;
        }
    }

    await browser.storage.sync.set({
        [improvePerformanceStorageKey]: improvePerformanceSwitch.checked,
    });
});
