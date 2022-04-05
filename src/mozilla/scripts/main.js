"use strict";
(async () => {
    const descriptionKey = 'description';
    const desktopKey = 'desktop';
    const requestKey = 'request';
    const updateKey = 'update';
    //Description
    const description = document.getElementById(descriptionKey);
    description.textContent = String(browser.runtime.getManifest().description);
    //Desktop Interface Button
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const requestStatus = {};
    const desktopButton = document.getElementById(desktopKey);
    let [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
    browser.tabs.onUpdated.addListener((id, _changes, newTab) => {
        if (typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;
            tab = newTab;
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
            return;
        }
        delete requestStatus[id];
    });
    desktopButton.addEventListener('click', async () => {
        const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
        await browser.tabs.update(tab.id, {
            url: cleanURL,
        });
    });
    //Settings Handling
    const requestButton = document.getElementById(requestKey);
    const updateButton = document.getElementById(updateKey);
    const keys = await browser.storage.sync.get([
        requestKey,
        updateKey,
    ]);
    requestButton.checked = keys[requestKey];
    updateButton.checked = keys[updateKey];
    requestButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [requestKey]: requestButton.checked,
        });
    });
    updateButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [updateKey]: updateButton.checked,
        });
    });
})();
