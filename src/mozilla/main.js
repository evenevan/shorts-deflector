"use strict";
(async () => {
    const newPagesKey = 'new-pages';
    const directKey = 'direct';
    const newPagesButton = document.getElementById(newPagesKey);
    const leftClickButton = document.getElementById(directKey);
    const enabledObject = await browser.storage.sync.get([newPagesKey]);
    const leftClickObject = await browser.storage.sync.get([directKey]);
    newPagesButton.checked = enabledObject[newPagesKey];
    leftClickButton.checked = leftClickObject[directKey];
    newPagesButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [newPagesKey]: newPagesButton.checked,
        });
    });
    leftClickButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [directKey]: leftClickButton.checked,
        });
    });
})();
