export function modifyGeneralPage() {
    // While we don't have the host permissions for non www, we can still change them
    // as YouTube uses non www for the share link for Shorts
    const youTubeShortsRegex = /^http(s)?:\/\/(www.)?youtube\.com\/shorts\/(.+)$/;

    const observer = new MutationObserver((mutationRecords) => {
        mutationRecords.forEach((mutation) => {
            if (mutation.type === 'attributes') {
                // If the type of attributes, then the mutation.target has changed href
                patchAnchor(mutation.target as HTMLAnchorElement);
            } else if (mutation.type === 'childList') {
                // If the type is childList, one of the target's children has changed
                const addedElements = Array.from(mutation.addedNodes)
                    .filter((addedNode) => addedNode instanceof HTMLElement);

                // Get all new children that have been added to the target
                addedElements
                    .filter((addedElement) => addedElement instanceof HTMLAnchorElement)
                    .forEach((anchor) => patchAnchor(anchor));

                // This is needed because if a newly added element has children,
                // those won't be in mutation.addedNodes
                addedElements
                    .map((addedElement) => Array.from(addedElement.getElementsByTagName('a')))
                    .flat(1)
                    .forEach((anchor) => patchAnchor(anchor));
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['href'],
        childList: true,
        subtree: true,
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const anchor of document.getElementsByTagName('a')) {
        patchAnchor(anchor);
    }

    // If patchAnchor modifies the href, that will indeed cause the observer
    // to fire an event. I don't know a fix and the overhead shouodl be minimal
    // but this is something to keep in mind
    function patchAnchor(anchor: HTMLAnchorElement) {
        if (anchor.href.match(youTubeShortsRegex)) {
            // eslint-disable-next-line no-param-reassign
            anchor.href = anchor.href.replace('shorts/', 'watch?v=');
        }

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
