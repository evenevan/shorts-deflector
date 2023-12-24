import { modifyGeneralPage } from './modifyGeneralPage.js';
import { modifyYouTubePage } from './modifyYouTubePage.js';
import { redirectShortsPage } from './redirectShortsPage.js';
import {
    automaticStorageKey,
    improvePerformanceStorageKey,
    runtime,
    youTubeRegex,
    youTubeShortsRegex,
} from '../util/constants.js';

export async function handlePageUpdate(tabId: number, tab: chrome.tabs.Tab) {
    const {
        [automaticStorageKey]: automatic,
        [improvePerformanceStorageKey]: improvePerformance,
    } = await runtime.storage.sync.get([
        automaticStorageKey,
        improvePerformanceStorageKey,
    ]);

    if (
        automatic === false
        || (improvePerformance === false && youTubeRegex.test(tab.url!) === false)
    ) {
        return;
    }

    const url = youTubeShortsRegex.test(tab.url!);

    if (url) {
        // Redirecting

        await runtime.scripting.executeScript({
            // @ts-ignore
            injectImmediately: true,
            target: {
                tabId: tabId,
            },
            func: redirectShortsPage,
        });
    } else {
        // URL Updating

        const script = youTubeRegex.test(tab.url!) ? modifyYouTubePage : modifyGeneralPage;

        await runtime.scripting.executeScript({
            target: {
                tabId: tabId,
            },
            func: script,
        });
    }
}
