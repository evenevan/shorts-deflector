(async () => {
    const normalKey = 'normal';
    const directKey = 'direct';

    const enabledButton = document.getElementById(
        normalKey,
    ) as HTMLFormElement;

    const leftClickButton = document.getElementById(
        directKey,
    ) as HTMLFormElement;

    const enabledObject = await chrome.storage.sync.get([normalKey]);
    const leftClickObject = await chrome.storage.sync.get([directKey]);

    enabledButton.checked = enabledObject[normalKey];
    leftClickButton.checked = leftClickObject[directKey];

    enabledButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [normalKey]: enabledButton.checked,
        });

        const declarativeNetRequestKey = enabledButton.checked
            ? 'enableRulesetIds'
            : 'disableRulesetIds';

        await chrome.declarativeNetRequest.updateEnabledRulesets({
            [declarativeNetRequestKey]: ['shorts'],
        });
    });

    leftClickButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [directKey]: leftClickButton.checked,
        });
    });
})();