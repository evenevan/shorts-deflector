(async () => {
    const normalKey = 'normal';
    const directKey = 'direct';

    const enabledButton = document.getElementById(
        normalKey,
    ) as HTMLFormElement;

    const leftClickButton = document.getElementById(
        directKey,
    ) as HTMLFormElement;

    const enabledObject = await browser.storage.sync.get([normalKey]);
    const leftClickObject = await browser.storage.sync.get([directKey]);

    enabledButton.checked = enabledObject[normalKey];
    leftClickButton.checked = leftClickObject[directKey];

    enabledButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [normalKey]: enabledButton.checked,
        });
    });

    leftClickButton.addEventListener('click', async () => {
        await browser.storage.sync.set({
            [directKey]: leftClickButton.checked,
        });
    });
})();