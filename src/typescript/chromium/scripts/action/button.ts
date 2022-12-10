import {
    desktopHTMLKey,
    desktopLinkHTMLKey,
    desktopLoadingHTMLKey,
    youTubeShortsRegex,
} from '../util/constants.js';

const desktopButton = document.getElementById(desktopHTMLKey) as HTMLButtonElement;

const desktopLinkButton = document.getElementById(desktopLinkHTMLKey) as HTMLAnchorElement;

const desktopButtonLoading = document.getElementById(desktopLoadingHTMLKey) as HTMLDivElement;

let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
});

update();

chrome.tabs.onUpdated.addListener((_id, _changes, newTab) => {
    if (newTab.id === tab?.id) {
        tab = newTab;

        update();
    }
});

desktopButton.addEventListener('click', async () => {
    desktopButton.disabled = true;
    desktopButtonLoading.classList.remove('hidden');

    const cleanURL = tab?.url?.replace('shorts/', 'watch?v=');

    await chrome.tabs.update(Number(tab?.id), {
        url: cleanURL,
    });
});

function update() {
    const isYouTubeShortsPage = Boolean(tab?.url?.match(youTubeShortsRegex));

    if (isYouTubeShortsPage) {
        const cleanURL = tab?.url?.replace('shorts/', 'watch?v=');
        desktopLinkButton.href = cleanURL!;
    } else {
        desktopLinkButton.removeAttribute('href');
    }

    if (tab?.status === 'complete') {
        desktopButtonLoading.classList.add('hidden');
        desktopButton.disabled = isYouTubeShortsPage === false;
    } else {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.remove('hidden');
    }
}
