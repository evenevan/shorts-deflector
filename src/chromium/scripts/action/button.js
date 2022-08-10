import { desktopHTMLKey, desktopLoadingHTMLKey, youTubeShortsRegex, } from '../util/constants.js';
const desktopButton = document.getElementById(desktopHTMLKey);
const desktopButtonLoading = document.getElementById(desktopLoadingHTMLKey);
let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
});
if (tab.status === 'loading') {
    desktopButton.disabled = true;
    desktopButtonLoading.classList.remove('hidden');
}
else {
    desktopButton.disabled = Boolean(tab?.url?.match(youTubeShortsRegex)) === false;
}
chrome.tabs.onUpdated.addListener((_id, _changes, newTab) => {
    tab = newTab;
    if (newTab.status === 'complete') {
        desktopButtonLoading.classList.add('hidden');
        desktopButton.disabled = Boolean(tab?.url?.match(youTubeShortsRegex)) === false;
    }
    else {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.remove('hidden');
    }
});
desktopButton.addEventListener('click', async () => {
    desktopButton.disabled = true;
    desktopButtonLoading.classList.add('hidden');
    const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
    await chrome.tabs.update(tab.id, {
        url: cleanURL,
    });
});
