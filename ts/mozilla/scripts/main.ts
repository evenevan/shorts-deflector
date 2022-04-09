(async () => {
    const nameKey = 'name';
    const descriptionKey = 'description';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';
    const requestKey = 'request';
    const updateKey = 'update';

    //Title
    const name = document.getElementById(
        nameKey,
    ) as HTMLSpanElement;

    name.textContent = String(
        browser.runtime.getManifest().name,
    );

    //Description
    const description = document.getElementById(
        descriptionKey,
    ) as HTMLSpanElement;

    description.textContent = String(
        browser.runtime.getManifest().description
            ?.replace('.', ''),
    );

    //Desktop Interface Button
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

    const desktopButton = document.getElementById(
        desktopKey,
    ) as HTMLButtonElement;

    const desktopButtonLoading = document.getElementById(
        desktopLoadingKey,
    ) as HTMLElement;

    let [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    if (tab.status === 'complete') {
        desktopButtonLoading.classList.add('hidden');
    } else {
        desktopButtonLoading.classList.remove('hidden');
    }

    desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;

    browser.tabs.onUpdated.addListener((id, _changes, newTab) => {
        if (newTab.status === 'complete') {
            tab = newTab;
            desktopButtonLoading.classList.add('hidden');
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
        } else {
            desktopButtonLoading.classList.remove('hidden');
            desktopButton.disabled = true;
        }
    });

    desktopButton.addEventListener('click', async () => {
        desktopButton.disabled = true;
        const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
        await browser.tabs.update(tab.id!, {
            url: cleanURL,
        });
    });

    //Settings Handling
    const requestButton = document.getElementById(
        requestKey,
    ) as HTMLFormElement;

    const updateButton = document.getElementById(
        updateKey,
    ) as HTMLFormElement;

    const keys = await browser.storage.sync.get([
        requestKey,
        updateKey,
    ]);

    requestButton.checked = keys[requestKey];
    updateButton.checked = keys[updateKey];

    requestButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [requestKey]: requestButton.checked,
        });
    });

    updateButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [updateKey]: updateButton.checked,
        });
    });
})();