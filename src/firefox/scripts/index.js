"use strict";
(async () => {
    [
        'extensionName',
        'switchToDesktopInterfaceTitle',
        'switchToDesktopInterfaceTooltip',
        'automaticTitle',
        'automaticDescription',
        'newPagesOnlyTitle',
        'newPagesOnlyDescription',
    ].forEach((value) => {
        const element = document.getElementById(value);
        element.textContent = chrome.i18n.getMessage(value);
    });
    const automaticKey = 'automatic';
    const newPagesOnlyKey = 'new-pages-only';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';
    // Desktop Interface Button
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const desktopButton = document.getElementById(desktopKey);
    const desktopButtonLoading = document.getElementById(desktopLoadingKey);
    let [tab] = await browser.tabs.query({
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
    browser.tabs.onUpdated.addListener((_id, _changes, newTab) => {
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
        await browser.tabs.update(tab.id, {
            url: cleanURL,
        });
    });
    // Settings Handling
    const automaticSwitch = document.getElementById(automaticKey);
    const newPagesOnlySwitch = document.getElementById(newPagesOnlyKey);
    const keys = await browser.storage.sync.get([
        automaticKey,
        newPagesOnlyKey,
    ]);
    automaticSwitch.checked = keys[automaticKey];
    newPagesOnlySwitch.checked = keys[newPagesOnlyKey];
    newPagesOnlySwitch.disabled = keys[automaticKey] === false;
    automaticSwitch.addEventListener('click', async () => {
        newPagesOnlySwitch.disabled = automaticSwitch.checked === false;
        await browser.storage.sync.set({
            [automaticKey]: automaticSwitch.checked,
        });
    });
    newPagesOnlySwitch.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [newPagesOnlyKey]: newPagesOnlySwitch.checked,
        });
    });
})();
