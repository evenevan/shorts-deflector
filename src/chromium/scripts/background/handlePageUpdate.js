import { modifyGeneralPage } from './modifyGeneralPage.js';
import { modifyYouTubePage } from './modifyYouTubePage.js';
import { automaticStorageKey, improvePerformanceStorageKey, youTubeRegex, youTubeShortsRegex, } from '../util/constants.js';
export async function handlePageUpdate(tabId, tab) {
    const { [automaticStorageKey]: automatic, [improvePerformanceStorageKey]: improvePerformance, } = await chrome.storage.sync.get([
        automaticStorageKey,
        improvePerformanceStorageKey,
    ]);
    if (automatic === false
        || (improvePerformance === false
            && youTubeRegex.test(tab.url) === false)) {
        return;
    }
    const url = youTubeShortsRegex.test(tab.url);
    if (url) {
        // Redirecting
        const cleanURL = tab.url.replace('shorts/', 'watch?v=');
        await chrome.tabs.update(tabId, {
            url: cleanURL,
        });
    }
    else {
        // URL Updating
        const script = youTubeRegex.test(tab.url)
            ? modifyYouTubePage
            : modifyGeneralPage;
        await chrome.scripting.executeScript({
            target: {
                tabId: tabId,
            },
            func: script,
        });
    }
}
