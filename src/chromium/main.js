"use strict";
(async () => {
    const newPagesKey = 'new-pages';
    const directKey = 'direct';
    const newPagesButton = document.getElementById(newPagesKey);
    const leftClickButton = document.getElementById(directKey);
    const enabledObject = await chrome.storage.sync.get([newPagesKey]);
    const leftClickObject = await chrome.storage.sync.get([directKey]);
    newPagesButton.checked = enabledObject[newPagesKey];
    leftClickButton.checked = leftClickObject[directKey];
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
    leftClickButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [directKey]: leftClickButton.checked,
        });
    });
})();
