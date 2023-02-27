import {
    desktopHTMLKey,
    linkHTMLKey,
    loadingHTMLKey,
    youTubeShortsRegex,
} from '../util/constants.js';

const desktopButton = document.getElementById(desktopHTMLKey) as HTMLButtonElement;
const linkAnchor = document.getElementById(linkHTMLKey) as HTMLAnchorElement;
const loadingDiv = document.getElementById(loadingHTMLKey) as HTMLDivElement;

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
    linkAnchor.removeAttribute('href');
    linkAnchor.setAttribute('aria-disabled', 'true');
    loadingDiv.dataset.loading = 'true';
}

function loaded() {
    const isNotYouTubeShortsPage = !tab?.url?.match(youTubeShortsRegex);
    desktopButton.disabled = isNotYouTubeShortsPage;
    linkAnchor.setAttribute('aria-disabled', `${isNotYouTubeShortsPage}`);
    loadingDiv.dataset.loading = 'false';

    if (isNotYouTubeShortsPage) {
        linkAnchor.removeAttribute('href');
    } else {
        linkAnchor.href = tab?.url?.replace('shorts/', 'watch?v=')!;
    }
}
