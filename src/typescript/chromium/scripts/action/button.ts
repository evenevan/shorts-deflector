import {
    desktopHTMLKey,
    desktopLinkHTMLKey,
    desktopLoadingHTMLKey,
    youTubeShortsRegex,
} from '../util/constants.js';

const desktopButton = document.getElementById(desktopHTMLKey) as HTMLButtonElement;
const desktopButtonLink = document.getElementById(desktopLinkHTMLKey) as HTMLAnchorElement;
const desktopButtonLoading = document.getElementById(desktopLoadingHTMLKey) as HTMLDivElement;

// eslint-disable-next-line no-script-url
const blankHref = 'javascript:void(0);';

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
    loading();

    const cleanURL = tab?.url?.replace('shorts/', 'watch?v=');

    await chrome.tabs.update((tab!.id!), {
        url: cleanURL,
    });
});

function update() {
    if (tab?.status === 'complete') {
        loaded();
    } else {
        loading();
    }
}

function loading() {
    desktopButton.disabled = true;
    desktopButtonLink.href = blankHref;
    desktopButtonLink.ariaDisabled = 'true';
    desktopButtonLoading.dataset.loading = 'true';
}

function loaded() {
    const isNotYouTubeShortsPage = !tab?.url?.match(youTubeShortsRegex);
    desktopButton.disabled = isNotYouTubeShortsPage;
    desktopButtonLink.href = isNotYouTubeShortsPage
        ? blankHref
        : tab?.url?.replace('shorts/', 'watch?v=')!;
    desktopButtonLink.ariaDisabled = `${isNotYouTubeShortsPage}`;
    desktopButtonLoading.dataset.loading = 'false';
}
