(async () => {
    const newPagesKey = 'new-pages';
    const directKey = 'direct';

    const newPagesButton = document.getElementById(
        newPagesKey,
    ) as HTMLFormElement;

    const directButton = document.getElementById(
        directKey,
    ) as HTMLFormElement;

    const enabledObject = await chrome.storage.sync.get([newPagesKey]);
    const directObject = await chrome.storage.sync.get([directKey]);

    newPagesButton.checked = enabledObject[newPagesKey];
    directButton.checked = directObject[directKey];

    newPagesButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [newPagesKey]: newPagesButton.checked,
        });

        const declarativeNetRequestKey = newPagesButton.checked
            ? 'enableRulesetIds'
            : 'disableRulesetIds';

        await chrome.declarativeNetRequest.updateEnabledRulesets({
            [declarativeNetRequestKey]: ['shorts'],
        });
    });

    directButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [directKey]: directButton.checked,
        });
    });
})();