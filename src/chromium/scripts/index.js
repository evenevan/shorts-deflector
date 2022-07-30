"use strict";
(async () => {
    [
        'extensionName',
        'switchToDesktopInterfaceTitle',
        'switchToDesktopInterfaceTooltip',
        'automaticTitle',
        'automaticDescription',
    ].forEach((value) => {
        const element = document.getElementById(value);
        element.textContent = chrome.i18n.getMessage(value);
    });
    const automaticKey = 'automatic';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';
    // Desktop Interface Button
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
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
        desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
    }
    chrome.tabs.onUpdated.addListener((_id, _changes, newTab) => {
        tab = newTab;
        if (newTab.status === 'complete') {
            desktopButtonLoading.classList.add('hidden');
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
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
    const keys = await chrome.storage.sync.get([
        automaticKey,
    ]);
    automaticSwitch.checked = keys[automaticKey];
    automaticSwitch.addEventListener('click', async () => {
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
})();
