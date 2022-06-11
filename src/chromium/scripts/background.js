"use strict";
(() => {
    const automaticKey = 'automatic';
    //Legacy Keys
    const requestKey = 'request';
    const updateKey = 'update';
    //Install/Update Handling
    chrome.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === chrome.runtime.OnInstalledReason.INSTALL ||
            details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
            const keys = await chrome.storage.sync.get(null);
            const newKeys = {
                [automaticKey]: keys[automaticKey] ??
                    (keys[requestKey] || keys[updateKey]) ??
                    true,
            };
            await chrome.storage.sync.set(newKeys);
            console.log('Set settings', newKeys);
        }
    });
    //Page Update Option Redirecting
    const requestStatus = {};
    chrome.tabs.onUpdated.addListener(async (id, _info, tab) => {
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);
        if (tab.status === 'complete' && requestStatus[id]) {
            delete requestStatus[id];
            return;
        }
        if (url && tab.url && tab.id && typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;
            const { [automaticKey]: auto } = await chrome.storage.sync.get([
                automaticKey,
            ]);
            if (auto) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');
                try {
                    await chrome.tabs.goBack(tab.id);
                    // eslint-disable-next-line no-empty
                }
                catch { }
                await chrome.tabs.update(tab.id, {
                    url: cleanURL,
                });
            }
        }
    });
})();
