export function modifyGeneralPage() {
    const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

    const observer = new MutationObserver((mutationRecords) => {
        const addedNodes = mutationRecords
            .map((record) => [...Object.values(record.addedNodes), record.target])
            .flat(1);

        const addedElements = addedNodes.filter(
            (addedNode) => addedNode instanceof HTMLElement && addedNode.children.length !== 0,
        ) as HTMLElement[];

        const targetAnchors = addedElements.filter(
            (addedElement) => addedElement instanceof HTMLAnchorElement,
        ) as HTMLAnchorElement[];

        const anchors = addedElements
            .map((addedElement) => Object.values(addedElement.getElementsByTagName('a')))
            .flat(1)
            .concat(targetAnchors);

        anchors.forEach((anchor) => {
            if (anchor.href.match(youTubeShortsRegex)) {
                patchAnchor(anchor);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const anchor of document.getElementsByTagName('a')) {
        if (anchor.href.match(youTubeShortsRegex)) {
            patchAnchor(anchor);
        }
    }

    function patchAnchor(anchor: HTMLAnchorElement) {
        // eslint-disable-next-line no-param-reassign
        anchor.href = anchor.href.replace('shorts/', 'watch?v=');

        /*
        This probably breaks things more than it helps

        anchor.addEventListener(
            'click',
            (event) => {
                event.stopImmediatePropagation();
            },
            true,
        );
         */
    }
}
