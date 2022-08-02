"use strict";
(async () => {
    [
        'extensionName',
        'switchToDesktopInterfaceTitle',
        'switchToDesktopInterfaceTooltip',
        'automaticTitle',
        'automaticDescription',
        'improvePerformanceTitle',
        'improvePerformanceDescription',
    ].forEach((value) => {
        const element = document.getElementById(value);
        element.textContent = chrome.i18n.getMessage(value);
    });
    // chrome.storage Keys
    const automaticKey = 'automatic';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';
    const improvePerformanceKey = 'improvePerformance';
    // Hostnames
    const youTubeHostname = 'https://www.youtube.com/*';
    const allHostname = '*://*/*';
    // Desktop Interface Button
    const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const desktopButton = document.getElementById(desktopKey);
    const desktopButtonLoading = document.getElementById(desktopLoadingKey);
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (tab.status === 'loading') {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.remove('hidden');
    }
    else {
        desktopButton.disabled = Boolean(tab?.url?.match(youTubeShortsRegex)) === false;
    }
    chrome.tabs.onUpdated.addListener((_id, _changes, newTab) => {
        tab = newTab;
        if (newTab.status === 'complete') {
            desktopButtonLoading.classList.add('hidden');
            desktopButton.disabled = Boolean(tab?.url?.match(youTubeShortsRegex)) === false;
        }
        else {
            desktopButton.disabled = true;
            desktopButtonLoading.classList.remove('hidden');
        }
    });
    desktopButton.addEventListener('click', async () => {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.add('hidden');
        const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
        await chrome.tabs.update(tab.id, {
            url: cleanURL,
        });
    });
    // Settings Handling
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
