import {
    automaticKey,
    improvePerformanceKey,
    youTubeRegex,
    youTubeShortsRegex,
} from '../util/constants.js';
import { replaceURLs } from './replaceURLs.js';

export async function handlePageUpdate(tabId: number, tab: chrome.tabs.Tab) {
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
            func: replaceURLs,
        });
    }
}