import {
    desktopHTMLKey,
    desktopLinkHTMLKey,
    desktopLoadingHTMLKey,
    youTubeShortsRegex,
} from '../util/constants.js';

const desktopButton = document.getElementById(desktopHTMLKey) as HTMLButtonElement;
const desktopButtonLink = document.getElementById(desktopLinkHTMLKey) as HTMLAnchorElement;
const desktopButtonLoading = document.getElementById(desktopLoadingHTMLKey) as HTMLDivElement;

let [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
});

update();

browser.tabs.onUpdated.addListener((_id, _changes, newTab) => {
    if (newTab.id === tab?.id) {
        tab = newTab;

        update();
    }
});

desktopButton.addEventListener('click', async () => {
    loading();

    const cleanURL = tab?.url?.replace('shorts/', 'watch?v=');

    await browser.tabs.update((tab!.id!), {
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
    desktopButtonLink.removeAttribute('href');
    desktopButtonLink.setAttribute('aria-disabled', 'true');
    desktopButtonLoading.dataset.loading = 'true';
}

function loaded() {
    const isNotYouTubeShortsPage = !tab?.url?.match(youTubeShortsRegex);
    desktopButton.disabled = isNotYouTubeShortsPage;
    if (isNotYouTubeShortsPage) {
        desktopButtonLink.removeAttribute('href');
    } else {
        desktopButtonLink.href = tab?.url?.replace('shorts/', 'watch?v=')!;
    }
    desktopButtonLink.setAttribute('aria-disabled', `${isNotYouTubeShortsPage}`);
    desktopButtonLoading.dataset.loading = 'false';
}
