"use strict";
(async () => {
    const nameKey = 'name';
    const descriptionKey = 'description';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';
    const requestKey = 'request';
    const updateKey = 'update';
    //Title
    const name = document.getElementById(nameKey);
    name.textContent = String(browser.runtime.getManifest().name);
    //Description
    const description = document.getElementById(descriptionKey);
    description.textContent = String(browser.runtime.getManifest().description
        ?.replace('.', ''));
    //Desktop Interface Button
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
