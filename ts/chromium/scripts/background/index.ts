import { handlePageUpdate } from './handlePageUpdate.js';
import {
    youTubeHostname,
    allHostname,
    automaticKey,
    improvePerformanceKey,
    protectedURLsRegex,
} from '../util/constants.js';

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
        && protectedURLsRegex.test(details.url!) === false
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
        && protectedURLsRegex.test(details.url!) === false
    ) {
        const tab = await chrome.tabs.get(details.tabId);

        if (details.url === tab.url) {
            await handlePageUpdate(details.tabId, tab);
        }
    }
});