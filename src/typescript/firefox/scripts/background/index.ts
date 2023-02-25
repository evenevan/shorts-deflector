import { handlePageUpdate } from './handlePageUpdate.js';
import {
    allHostname,
    automaticStorageKey,
    improvePerformanceStorageKey,
    youTubeHostname,
} from '../util/constants.js';

// Install/Update Handling
browser.runtime.onInstalled.addListener(async (details) => {
    if (
        details.reason === browser.runtime.OnInstalledReason.INSTALL
        || details.reason === browser.runtime.OnInstalledReason.UPDATE
    ) {
        const keys = await browser.storage.sync.get(null);

        // @ts-ignore
        const automaticPermission = await browser.permissions.contains({
            origins: [youTubeHostname],
        });

        // @ts-ignore
        const improvePerformancePermission = await browser.permissions.contains({
            origins: [allHostname],
        });

        const newKeys = {
            [automaticStorageKey]:
                typeof keys[automaticStorageKey] !== 'undefined'
                    ? keys[automaticStorageKey] && automaticPermission
                    : automaticPermission,
            [improvePerformanceStorageKey]:
                typeof keys[improvePerformanceStorageKey] !== 'undefined'
                    ? keys[improvePerformanceStorageKey] && improvePerformancePermission
                    : improvePerformancePermission,
        };

        await browser.storage.sync.set(newKeys);

        console.log('Set settings', newKeys);
    }
});

// Handle Permission Removal
browser.permissions.onRemoved.addListener(async () => {
    // @ts-ignore
    const automaticPermission = (await browser.permissions.contains({
        origins: [youTubeHostname],
    })) as unknown as boolean;

    // @ts-ignore
    const improvePerformancePermission = (await browser.permissions.contains({
        origins: [allHostname],
    })) as unknown as boolean;

    await browser.storage.sync.set({
        [automaticStorageKey]: automaticPermission,
        [improvePerformanceStorageKey]: improvePerformancePermission,
    });
});

// Listener for new pages with the same URL
browser.webNavigation.onCommitted.addListener(
    async (details) => {
        if (details.frameId === 0) {
            const tab = await browser.tabs.get(details.tabId);

            if (details.url === tab.url) {
                await handlePageUpdate(details.tabId, tab);
            }
        }
    },
    {
        url: [
            {
                schemes: ['http', 'https'],
            },
        ],
    },
);

// Listener for new pages with new URLs
browser.webNavigation.onHistoryStateUpdated.addListener(
    async (details) => {
        if (details.frameId === 0) {
            const tab = await browser.tabs.get(details.tabId);

            if (details.url === tab.url) {
                await handlePageUpdate(details.tabId, tab);
            }
        }
    },
    {
        url: [
            {
                schemes: ['http', 'https'],
            },
        ],
    },
);
