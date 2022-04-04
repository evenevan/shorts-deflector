"use strict";
(() => {
    const requestKey = 'request';
    const updateKey = 'update';
    browser.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === 'install' || details.reason === 'update') {
            const keys = await browser.storage.sync.get(null);
            const newKeys = {
                [requestKey]: keys[requestKey] ?? true,
                [updateKey]: keys[updateKey] ?? true,
            };
            await browser.storage.sync.set(newKeys);
            console.log('Set settings', newKeys);
        }
    });
    //@ts-expect-error FireFox can handle async onBeforeRequest
    //eslint-disable-next-line consistent-return
    browser.webRequest.onBeforeRequest.addListener(async (details) => {
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = details.url?.match(regex);
        if (details.url && url?.[0]) {
            const { [requestKey]: request } = await browser.storage.sync.get([
                requestKey,
            ]);
            if (request) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');
                return {
                    redirectUrl: cleanURL,
                };
            }
        }
    }, {
        urls: [
            '*://www.youtube.com/shorts/*',
        ],
    }, [
        'blocking',
    ]);
    const requestStatus = {};
    browser.tabs.onUpdated.addListener(async (id, info, tab) => {
        const regex = /^https:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);
        if (tab.status === 'complete' && requestStatus[id]) {
            delete requestStatus[id];
            return;
        }
        if (url && tab.url && tab.id && typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;
            const { [updateKey]: update } = await browser.storage.sync.get([
                updateKey,
            ]);
            if (update) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');
                await browser.tabs.goBack(tab.id);
                await browser.tabs.update(tab.id, {
                    url: cleanURL,
                });
            }
        }
        //@ts-expect-error Mozilla version has extra params
    }, {
        urls: [
            '*://www.youtube.com/shorts/*',
        ],
    });
})();
