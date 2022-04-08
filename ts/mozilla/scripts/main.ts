(async () => {
    const nameKey = 'name';
    const descriptionKey = 'description';
    const desktopKey = 'desktop';
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
    const requestStatus: {[key: string]: string | undefined} = {};

    const desktopButton = document.getElementById(
        desktopKey,
    ) as HTMLButtonElement;

    let [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;

    browser.tabs.onUpdated.addListener((id, _changes, newTab) => {
        if (typeof requestStatus[id] === 'undefined') {
            requestStatus[id] = tab.status;
            tab = newTab;
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
            return;
        }

        delete requestStatus[id];
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