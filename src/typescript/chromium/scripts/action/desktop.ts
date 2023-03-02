import { cleanURL } from '../util/cleanURL.js';
import {
    desktopHTMLKey,
    dynamicHTMLKey,
    linkHTMLKey,
    youTubeShortsRegex,
} from '../util/constants.js';

const desktopButton = document.getElementById(desktopHTMLKey) as HTMLButtonElement;
const linkAnchor = document.getElementById(linkHTMLKey) as HTMLAnchorElement;
const dynamicDiv = document.getElementById(dynamicHTMLKey) as HTMLDivElement;

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

    await chrome.tabs.update((tab!.id!), {
        url: cleanURL(tab?.url),
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
    dynamicDiv.dataset.state = 'loading';
    linkAnchor.removeAttribute('href');
    linkAnchor.setAttribute('aria-disabled', 'true');
}

function loaded() {
    const isNotYouTubeShortsPage = !tab?.url?.match(youTubeShortsRegex);

    desktopButton.disabled = isNotYouTubeShortsPage;
    dynamicDiv.dataset.state = 'link';
    linkAnchor.setAttribute('aria-disabled', isNotYouTubeShortsPage.toString());

    if (isNotYouTubeShortsPage) {
        linkAnchor.removeAttribute('href');
    } else {
        linkAnchor.setAttribute('href', cleanURL(tab?.url));
    }
}
