chrome.tabs.onUpdated.addListener(async (_id, info, tab) => {
    const regex = /^https:\/\/www.youtube.com\/shorts\/(.+)$/;
    const url = tab.url?.match(regex);

    if (tab.url && url && tab.id && info?.status === 'complete') {
        const cleanURL = url[0].replace('shorts/', 'watch?v=');

        await chrome.tabs.goBack();
        await chrome.tabs.update(tab.id, {
            url: cleanURL,
        });
    }
});

/**
 * chrome.webRequest.onBeforeRequest.addListener(details => {
    const regex = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.be)\/shorts\/(.+)$/;
    const url = details.url?.match(regex);

    if (details.url && url) {
        const cleanURL = url[0].replace('shorts/', 'watch?v=');

        return {
            redirectUrl: cleanURL,
        };
    }
});
 */