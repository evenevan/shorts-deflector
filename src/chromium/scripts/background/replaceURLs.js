export function replaceURLs() {
    const regex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const observer = new MutationObserver((mutationRecords) => {
        // Only works on YouTube, faster
        /*
        mutationRecords.forEach((mutationRecord) => {
            if (
                mutationRecord.type === 'attributes'
                && mutationRecord.target.nodeType === 1
                && mutationRecord.target.nodeName === 'A'
            ) {
                const anchor = mutationRecord.target as HTMLAnchorElement;
                if (anchor.href.match(regex)) {
                    anchor.href = anchor.href.replace('shorts/', 'watch?v=');

                    anchor.addEventListener('click', (event) => {
                        event.stopImmediatePropagation();
                    }, true);
                }
            }
        });
        */
        // Works on all sites, slower
        const addedNodes = mutationRecords.map((record) => [
            ...Object.values(record.addedNodes),
            record.target,
        ]).flat(1);
        const addedElements = addedNodes.filter((addedNode) => addedNode instanceof HTMLElement
            && addedNode.children.length !== 0);
        const targetAnchors = addedElements.filter((addedElement) => addedElement instanceof HTMLAnchorElement);
        const anchors = addedElements.map((addedElement) => Object.values(addedElement.getElementsByTagName('a'))).flat(1).concat(targetAnchors);
        anchors.forEach((anchor) => {
            if (anchor.href.match(regex)) {
                // eslint-disable-next-line no-param-reassign
                anchor.href = anchor.href.replace('shorts/', 'watch?v=');
                anchor.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                }, true);
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
        if (anchor.href.match(regex)) {
            anchor.href = anchor.href.replace('shorts/', 'watch?v=');
            anchor.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
            }, true);
        }
    }
}
