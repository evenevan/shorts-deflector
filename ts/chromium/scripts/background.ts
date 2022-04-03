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

            console.log('Set default settings');
        }
    });

    chrome.tabs.onUpdated.addListener(async (_id, info, tab) => {
        const regex = /^https:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);

        if (tab.url && tab.id && url && info?.status === 'complete') {
            const updateObject = await chrome.storage.sync.get([
                updateKey,
            ]);

            if (updateObject[updateKey] === true) {
                const cleanURL = url[0].replace('shorts/', 'watch?v=');

                await chrome.tabs.goBack();
                await chrome.tabs.update(tab.id, {
                    url: cleanURL,
                });
            }
        }
    });
})();