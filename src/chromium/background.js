"use strict";
(() => {
    const newPagesKey = 'new-pages';
    const directKey = 'direct';
    chrome.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === 'install') {
            await chrome.storage.sync.set({
                [newPagesKey]: true,
                [directKey]: true,
            });
        }
    });
    chrome.tabs.onUpdated.addListener(async (_id, info, tab) => {
        const regex = /^https:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);
        if (tab.url && tab.id && url && info?.status === 'complete') {
            const leftClickObject = await chrome.storage.sync.get([
                directKey,
            ]);
            if (leftClickObject[directKey] === true) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');
                await chrome.tabs.goBack();
                await chrome.tabs.update(tab.id, {
                    url: cleanURL,
                });
            }
        }
    });
})();
