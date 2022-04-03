(() => {
    const requestKey = 'request';
    const updateKey = 'update';

    browser.runtime.onInstalled.addListener(async details => {
        if (details.reason === 'install' || details.reason === 'update') {
            const keys = await browser.storage.sync.get([
                requestKey,
                updateKey,
            ]);

            await browser.storage.sync.set({
                [requestKey]: keys[requestKey] ?? true,
                [updateKey]: keys[updateKey] ?? true,
            });

            console.log('Set default settings');
        }
    });

    //@ts-expect-error FireFox can handle async onBeforeRequest
    //eslint-disable-next-line consistent-return
    browser.webRequest.onBeforeRequest.addListener(async details => {
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = details.url?.match(regex);

        if (details.url && url?.[0]) {
            const requestObject = await browser.storage.sync.get([
                requestKey,
            ]);

            if (requestObject[requestKey] === true) {
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

    browser.tabs.onUpdated.addListener(async (_id, info, tab) => {
        const regex = /^https:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);

        if (tab.url && tab.id && url && info?.status === 'complete') {
            const updateObject = await browser.storage.sync.get([
                updateKey,
            ]);

            if (updateObject[updateKey] === true) {
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