"use strict";
(async () => {
    const nameKey = 'name';
    const descriptionKey = 'description';
    const desktopKey = 'desktop';
    const requestKey = 'request';
    const updateKey = 'update';
    //Title
    const name = document.getElementById(nameKey);
    name.textContent = String(chrome.runtime.getManifest().name);
    //Description
    const description = document.getElementById(descriptionKey);
    description.textContent = String(chrome.runtime.getManifest().description
        ?.replace('.', ''));
    //Desktop Interface Button
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const requestStatus = {};
    const desktopButton = document.getElementById(desktopKey);
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
    chrome.tabs.onUpdated.addListener((id, _changes, newTab) => {
        if (typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;
            tab = newTab;
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
            return;
        }
        delete requestStatus[id];
    });
    desktopButton.addEventListener('click', async () => {
        desktopButton.disabled = true;
        const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
        await chrome.tabs.update(tab.id, {
            url: cleanURL,
        });
    });
    //Settings Handling
    const requestButton = document.getElementById(requestKey);
    const updateButton = document.getElementById(updateKey);
    const keys = await chrome.storage.sync.get([
        requestKey,
        updateKey,
    ]);
    requestButton.checked = keys[requestKey];
    updateButton.checked = keys[updateKey];
    requestButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [requestKey]: requestButton.checked,
        });
        const declarativeNetRequestKey = requestButton.checked
            ? 'enableRulesetIds'
            : 'disableRulesetIds';
        await chrome.declarativeNetRequest.updateEnabledRulesets({
            [declarativeNetRequestKey]: ['shorts'],
        });
    });
    updateButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [updateKey]: updateButton.checked,
        });
    });
})();
