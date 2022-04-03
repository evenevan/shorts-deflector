"use strict";
(async () => {
    const requestKey = 'request';
    const updateKey = 'update';
    const requestButton = document.getElementById(requestKey);
    const updateButton = document.getElementById(updateKey);
    const keys = await chrome.storage.sync.get([
        requestKey,
        updateKey,
    ]);
    requestButton.checked = keys[requestKey];
    updateButton.checked = keys[updateKey];
    requestButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [requestKey]: requestButton.checked,
        });
        const declarativeNetRequestKey = requestButton.checked
            ? 'enableRulesetIds'
            : 'disableRulesetIds';
        await chrome.declarativeNetRequest.updateEnabledRulesets({
            [declarativeNetRequestKey]: ['shorts'],
        });
    });
    updateButton.addEventListener('click', async () => {
        await chrome.storage.sync.set({
            [updateKey]: updateButton.checked,
        });
    });
})();
