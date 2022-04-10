(async () => {
    const automaticKey = 'automatic';
    const nameKey = 'name';
    const desktopKey = 'desktop';
    const desktopLoadingKey = 'desktopLoading';

    //Title
    const name = document.getElementById(
        nameKey,
    ) as HTMLSpanElement;

    name.textContent = String(
        browser.runtime.getManifest().name,
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

    if (tab.status === 'loading') {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.remove('hidden');
    } else {
        desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
    }

    browser.tabs.onUpdated.addListener((_id, _changes, newTab) => {
        tab = newTab;

        if (newTab.status === 'complete') {
            desktopButtonLoading.classList.add('hidden');
            desktopButton.disabled = Boolean(tab?.url?.match(regex)) === false;
        } else {
            desktopButton.disabled = true;
            desktopButtonLoading.classList.remove('hidden');
        }
    });

    desktopButton.addEventListener('click', async () => {
        desktopButton.disabled = true;
        desktopButtonLoading.classList.add('hidden');
        const cleanURL = tab.url?.replace('shorts/', 'watch?v=');
        await browser.tabs.update(tab.id!, {
            url: cleanURL,
        });
    });

    //Settings Handling
    const automaticSwitch = document.getElementById(
        automaticKey,
    ) as HTMLInputElement;

    const keys = await browser.storage.sync.get([
        automaticKey,
    ]);

    automaticSwitch.checked = keys[automaticKey];

    automaticSwitch.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [automaticKey]: automaticSwitch.checked,
        });
    });
})();