"use strict";
(() => {
    const automaticKey = 'automatic';
    // Legacy Keys
    const requestKey = 'request';
    const updateKey = 'update';
    // Install/Update Handling
    chrome.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === chrome.runtime.OnInstalledReason.INSTALL
            || details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
            const keys = await chrome.storage.sync.get(null);
            const newKeys = {
                [automaticKey]: keys[automaticKey]
                    ?? (keys[requestKey] || keys[updateKey])
                    ?? true,
            };
            await chrome.storage.sync.set(newKeys);
            console.log('Set settings', newKeys);
        }
    });
    chrome.webNavigation.onCommitted.addListener(async (details) => {
        // Listener for new pages with the same URL
        if (details.frameId === 0
            && /^http(s)?:\/\/www\.youtube\.com/.test(details.url)
            && (details.transitionType === 'auto_bookmark'
                || details.transitionType === 'link'
                || details.transitionType === 'reload'
                || details.transitionType === 'typed')) {
            const tab = await chrome.tabs.get(details.tabId);
            await handlePageUpdate(details.tabId, tab, 0);
        }
    });
    chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
        // Listener for new pages with new URLs
        if (details.frameId === 0
            && /^http(s)?:\/\/www\.youtube\.com/.test(details.url)) {
            const tab = await chrome.tabs.get(details.tabId);
            await handlePageUpdate(details.tabId, tab, 1);
        }
    });
    let latestRequest = null;
    async function handlePageUpdate(tabId, tab, source) {
        // Request Dedupe
        if (latestRequest === `${tab.id}${tab.url}` && source !== 0) {
            return;
        }
        const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
        const url = tab.url?.match(regex);
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
            await chrome.tabs.update(tabId, {
                url: cleanURL,
            });
        }
        else {
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
        // eslint-disable-next-line no-restricted-syntax
        for (const anchor of document.getElementsByTagName('a')) {
            if (anchor.href.match(regex)) {
                anchor.href = anchor.href.replace('shorts/', 'watch?v=');
                anchor.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                }, true);
            }
        }
        const observer = new MutationObserver((mutationRecords) => {
            // Only works on YouTube, fast & reliable
            mutationRecords.forEach((mutationRecord) => {
                if (mutationRecord.type === 'attributes'
                    && mutationRecord.target.nodeType === 1
                    && mutationRecord.target.nodeName === 'A') {
                    const anchor = mutationRecord.target;
                    if (anchor.href.match(regex)) {
                        anchor.href = anchor.href.replace('shorts/', 'watch?v=');
                        anchor.addEventListener('click', (event) => {
                            event.stopImmediatePropagation();
                        }, true);
                    }
                }
            });
            /*
            // Works on all tested sites, slightly buggy at times
            const uniqueClass = 'shorts-deflector';

            const addedNodes = mutationRecords.map(
                (record) => Object.values(record.addedNodes),
            ).flat(1);

            const addedElements = addedNodes.filter(
                (addedNode) => addedNode.nodeType === 1
                && addedNode.childNodes.length !== 0,
            ) as HTMLElement[];

            const anchors = addedElements.map(
                (addedElement) => Object.values(
                    addedElement.getElementsByTagName('a'),
                ),
            ).flat(1);

            anchors.forEach((anchor) => {
                const isNotNew = anchor.classList.contains(uniqueClass);

                if (isNotNew) {
                    return;
                }

                anchor.classList.add(uniqueClass);

                if (anchor.href.match(regex)) {
                    anchor.href = anchor.href.replace('shorts/', 'watch?v=');

                    anchor.addEventListener('click', (event) => {
                        event.stopImmediatePropagation();
                    }, true);
                }
            });
            */
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['href'],
            childList: true,
            subtree: true,
        });
    }
})();
