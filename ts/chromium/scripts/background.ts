// chrome.storage Keys
const automaticKey = 'automatic';
const improvePerformanceKey = 'improvePerformance';

// Hostnames
const youTubeHostname = 'https://www.youtube.com/*';
const allHostname = '*://*/*';

// Regex
const chromeRegex = /^chrome:\/\//;
const youTubeRegex = /^http(s)?:\/\/www\.youtube\.com/;
const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

// Install/Update Handling
chrome.runtime.onInstalled.addListener(async (details) => {
    if (
        details.reason === chrome.runtime.OnInstalledReason.INSTALL
        || details.reason === chrome.runtime.OnInstalledReason.UPDATE
    ) {
        const keys = await chrome.storage.sync.get(null);

        // @ts-ignore
        const automaticPermission = await chrome.permissions.contains({
            origins: [youTubeHostname],
        });

        // @ts-ignore
        const improvePerformancePermission = await chrome.permissions.contains({
            origins: [allHostname],
        });

        const newKeys = {
            [automaticKey]:
                keys[automaticKey]
                    ? keys[automaticKey] && automaticPermission
                    : automaticPermission,
            [improvePerformanceKey]:
                keys[improvePerformanceKey]
                    ? keys[improvePerformanceKey] && improvePerformancePermission
                    : improvePerformancePermission,
        };

        await chrome.storage.sync.set(newKeys);

        console.log('Set settings', newKeys);
    }
});

// Handle Permission Removal
chrome.permissions.onRemoved.addListener(async () => {
    // @ts-ignore
    const automaticPermission = await chrome.permissions.contains({
        origins: [youTubeHostname],
    }) as unknown as boolean;

    // @ts-ignore
    const improvePerformancePermission = await chrome.permissions.contains({
        origins: [allHostname],
    }) as unknown as boolean;

    if (automaticPermission === false) {
        await chrome.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: ['shorts'],
        });
    }

    await chrome.storage.sync.set({
        [automaticKey]: automaticPermission,
        [improvePerformanceKey]: improvePerformancePermission,
    });
});

// Listener for new pages with the same URL
chrome.webNavigation.onCommitted.addListener(async (details) => {
    if (
        details.frameId === 0
        && chromeRegex.test(details.url!) === false
    ) {
        const tab = await chrome.tabs.get(details.tabId);

        if (details.url === tab.url) {
            await handlePageUpdate(details.tabId, tab);
        }
    }
});

// Listener for new pages with new URLs
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    if (
        details.frameId === 0
        && chromeRegex.test(details.url!) === false
    ) {
        const tab = await chrome.tabs.get(details.tabId);

        if (details.url === tab.url) {
            await handlePageUpdate(details.tabId, tab);
        }
    }
});

async function handlePageUpdate(tabId: number, tab: chrome.tabs.Tab) {
    const {
        [automaticKey]: automatic,
        [improvePerformanceKey]: improvePerformance,
    } = await chrome.storage.sync.get([
        automaticKey,
        improvePerformanceKey,
    ]);

    if (
        automatic === false
        || (
            improvePerformance === false
            && youTubeRegex.test(String(tab.url)) === false
        )
    ) {
        return;
    }

    const url = tab.url?.match(youTubeShortsRegex);

    if (url) {
        // Redirecting

        const cleanURL = url[0].replace('shorts/', 'watch?v=');

        await chrome.tabs.update(tabId, {
            url: cleanURL,
        });
    } else {
        // URL Updating

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

    const observer = new MutationObserver((mutationRecords) => {
        // Only works on YouTube, faster
        /*
        mutationRecords.forEach((mutationRecord) => {
            if (
                mutationRecord.type === 'attributes'
                && mutationRecord.target.nodeType === 1
                && mutationRecord.target.nodeName === 'A'
            ) {
                const anchor = mutationRecord.target as HTMLAnchorElement;
                if (anchor.href.match(regex)) {
                    anchor.href = anchor.href.replace('shorts/', 'watch?v=');

                    anchor.addEventListener('click', (event) => {
                        event.stopImmediatePropagation();
                    }, true);
                }
            }
        });
        */

        // Works on all sites, slower
        const addedNodes = mutationRecords.map(
            (record) => [
                ...Object.values(record.addedNodes),
                record.target,
            ],
        ).flat(1);

        const addedElements = addedNodes.filter(
            (addedNode) => addedNode instanceof HTMLElement
            && addedNode.children.length !== 0,
        ) as HTMLElement[];

        const targetAnchors = addedElements.filter(
            (addedElement) => addedElement instanceof HTMLAnchorElement,
        ) as HTMLAnchorElement[];

        const anchors = addedElements.map(
            (addedElement) => Object.values(
                addedElement.getElementsByTagName('a'),
            ),
        ).flat(1).concat(targetAnchors);

        anchors.forEach((anchor) => {
            if (anchor.href.match(regex)) {
                // eslint-disable-next-line no-param-reassign
                anchor.href = anchor.href.replace('shorts/', 'watch?v=');

                anchor.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                }, true);
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['href'],
        childList: true,
        subtree: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const anchor of document.getElementsByTagName('a')) {
        if (anchor.href.match(regex)) {
            anchor.href = anchor.href.replace('shorts/', 'watch?v=');

            anchor.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
            }, true);
        }
    }
}