import { handlePageUpdate } from './handlePageUpdate.js';
import {
    allHostname,
    automaticStorageKey,
    improvePerformanceStorageKey,
    runtime,
    youTubeHostname,
} from '../util/constants.js';

// Install/Update Handling
runtime.runtime.onInstalled.addListener(async (details) => {
    if (
        details.reason === runtime.runtime.OnInstalledReason.INSTALL
        || details.reason === runtime.runtime.OnInstalledReason.UPDATE
    ) {
        const keys = await runtime.storage.sync.get(null);

        // @ts-ignore
        const automaticPermission = await runtime.permissions.contains({
            origins: [youTubeHostname],
        });

        // @ts-ignore
        const improvePerformancePermission = await runtime.permissions.contains({
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

        await runtime.storage.sync.set(newKeys);

        console.log('Set settings', newKeys);
    }
});

// Handle Permission Removal
runtime.permissions.onRemoved.addListener(async () => {
    // @ts-ignore
    const automaticPermission = (await runtime.permissions.contains({
        origins: [youTubeHostname],
    })) as unknown as boolean;

    // @ts-ignore
    const improvePerformancePermission = (await runtime.permissions.contains({
        origins: [allHostname],
    })) as unknown as boolean;

    if (automaticPermission === false) {
        await runtime.declarativeNetRequest.updateEnabledRulesets({
            disableRulesetIds: ['shorts'],
        });
    }

    await runtime.storage.sync.set({
        [automaticStorageKey]: automaticPermission,
        [improvePerformanceStorageKey]: improvePerformancePermission,
    });
});

// Listener for new pages with the same URL
runtime.webNavigation.onCommitted.addListener(
    async (details) => {
        if (details.frameId === 0) {
            const tab = await runtime.tabs.get(details.tabId);

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
runtime.webNavigation.onHistoryStateUpdated.addListener(
    async (details) => {
        if (details.frameId === 0) {
            const tab = await runtime.tabs.get(details.tabId);

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
