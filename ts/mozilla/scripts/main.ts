(async () => {
    const requestKey = 'request';
    const updateKey = 'update';

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