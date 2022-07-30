(() => {
    const automaticKey = 'automatic';

    // Legacy Keys
    const requestKey = 'request';
    const updateKey = 'update';

    // Install/Update Handling
    chrome.runtime.onInstalled.addListener(async (details) => {
        if (
            details.reason === chrome.runtime.OnInstalledReason.INSTALL
            || details.reason === chrome.runtime.OnInstalledReason.UPDATE
        ) {
            const keys = await chrome.storage.sync.get(null);

            const newKeys = {
                [automaticKey]:
                    keys[automaticKey]
                    ?? (keys[requestKey] || keys[updateKey])
                    ?? true,
            };

            await chrome.storage.sync.set(newKeys);

            console.log('Set settings', newKeys);
        }
    });

    chrome.webNavigation.onCommitted.addListener(async (details) => {
        // same url, new page
        if (
            details.frameId === 0
            && /^http(s)?:\/\/www\.youtube\.com/.test(details.url)
            && (
                details.transitionType === 'auto_bookmark'
                || details.transitionType === 'reload'
                || details.transitionType === 'typed'
            )
        ) {
            const tab = await chrome.tabs.get(details.tabId);
            await handlePageUpdate(details.tabId, tab, 0);
        }
    });

    chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
        // new url, new page
        if (
            details.frameId === 0
            && /^http(s)?:\/\/www\.youtube\.com/.test(details.url)
        ) {
            const tab = await chrome.tabs.get(details.tabId);
            await handlePageUpdate(details.tabId, tab, 1);
        }
    });

    let latestRequest: string | null = null;

    async function handlePageUpdate(tabId: number, tab: chrome.tabs.Tab, source: number) {
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);

        // Request Dedupe
        if (latestRequest === `${tab.id}${tab.url}` && source !== 0) {
            return;
        }

        const { [automaticKey]: automatic } = await chrome.storage.sync.get([
            automaticKey,
        ]);

        if (automatic === false) {
            return;
        }

        if (url) {
            // Redirecting

            latestRequest = `${tab.id}${tab.url}`;

            const cleanURL = url[0].replace('shorts/', 'watch?v=');

            try {
                await chrome.tabs.goBack(tabId);
                // eslint-disable-next-line no-empty
            } catch { }

            await chrome.tabs.update(tabId, {
                url: cleanURL,
            });
        } else {
            // URL Updating

            latestRequest = `${tab.id}${tab.url}`;

            await chrome.scripting.executeScript({
                target: {
                    tabId: tabId,
                },
                func: replaceURLsExecute,
            });
        }
    }

    function replaceURLsExecute() {
        // @ts-ignore different scope at runtime
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

        const uniqueClass = 'shorts-deflector';

        // eslint-disable-next-line no-restricted-syntax
        for (const anchor of document.getElementsByTagName('a')) {
            if (anchor.href.match(regex)) {
                anchor.href = anchor.href.replace('shorts/', 'watch?v=');
            }
        }

        const observer = new MutationObserver((mutationRecords) => {
            mutationRecords.forEach((mutationRecord) => {
                if (mutationRecord.type === 'childList') {
                    Object.values(mutationRecord.addedNodes).forEach((node) => {
                        if (
                            node.nodeType === 1
                            && node.childNodes.length !== 0
                        ) {
                            const element = node as HTMLElement;

                            const anchors = element.getElementsByTagName('a');

                            Object.values(anchors).forEach((anchor) => {
                                const isNew = anchor.classList.contains(uniqueClass) === false;

                                if (isNew) {
                                    anchor.classList.add(uniqueClass);

                                    if (anchor.href.match(regex)) {
                                        /* eslint-disable no-param-reassign */
                                        anchor.href = anchor.href.replace('shorts/', 'watch?v=');

                                        // YouTube overrides to make it work
                                        anchor.classList.remove('yt-simple-endpoint');

                                        if (anchor.id === 'video-title') {
                                            anchor.style.color = 'var(--yt-spec-text-primary)';
                                            anchor.style.cursor = 'pointer';
                                            anchor.style.textDecoration = 'none';
                                            anchor.style.fontFamily = '"Roboto","Arial",sans-serif';
                                            anchor.style.fontSize = '1.4rem';
                                            anchor.style.lineHeight = '2rem';
                                            anchor.style.fontWeight = '500';
                                            anchor.style.maxHeight = '4rem';
                                            anchor.style.overflow = 'hidden';
                                            // @ts-ignore
                                            anchor.style['-webkit-line-clamp'] = '2';
                                            anchor.style.display = '-webkit-box';
                                            // @ts-ignore
                                            anchor.style['=webkit-box-orient'] = 'vertical';
                                            anchor.style.textOverflow = 'ellipsis';
                                            anchor.style.whiteSpace = 'normal';
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
})();

/**
if (mutationRecord.type === 'attributes') {
    if (
        mutationRecord.attributeName === 'href'
        && mutationRecord.target.nodeName === 'A'
    ) {
        const anchor = mutationRecord.target as HTMLAnchorElement;

        anchor.classList.add(uniqueId);

        if (anchor.href.match(regex)) {
            // eslint-disable-next-line no-param-reassign
            anchor.href = anchor.href.replace('shorts/', 'watch?v=');
        }
    }
}
 */