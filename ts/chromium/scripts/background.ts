(() => {
    const requestKey = 'request';
    const updateKey = 'update';

    chrome.runtime.onInstalled.addListener(async details => {
        if (details.reason === 'install' || details.reason === 'update') {
            const keys = await chrome.storage.sync.get([
                requestKey,
                updateKey,
            ]);

            await chrome.storage.sync.set({
                [requestKey]: keys[requestKey] ?? true,
                [updateKey]: keys[updateKey] ?? true,
            });

            console.log('Set settings');
        }
    });

    const requestStatus: {[key: string]: string | undefined} = {};

    chrome.tabs.onUpdated.addListener(async (id, info, tab) => {
        const regex = /^https:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);

        if (tab.status === 'complete' && requestStatus[id]) {
            delete requestStatus[id];

            return;
        }

        if (url && tab.url && tab.id && typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;

            const { [updateKey]: update } = await chrome.storage.sync.get([
                updateKey,
            ]);

            if (update) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');

                await chrome.tabs.goBack(tab.id);
                await chrome.tabs.update(tab.id, {
                    url: cleanURL,
                });
            }
        }
    });
})();