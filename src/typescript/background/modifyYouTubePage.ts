// Special optimized algorithm for YouTube

export function modifyYouTubePage() {
    const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

    const observer = new MutationObserver((mutationRecords) => {
        const elements = mutationRecords
            .filter(
                (mutationRecord) => mutationRecord.type === 'attributes' && mutationRecord.target.nodeType === 1,
            )
            .map((mutationRecord) => mutationRecord.target) as HTMLElement[];

        elements.forEach((element) => {
            switch (element.tagName) {
                case 'A':
                    {
                        const anchor = element as HTMLAnchorElement;
                        if (anchor.href.match(youTubeShortsRegex)) {
                            patchAnchor(anchor);
                        }
                    }
                    break;
                case 'YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER': {
                    const attribute = element.attributes.getNamedItem('overlay-style');

                    if (attribute?.value === 'SHORTS') {
                        attribute.value = 'DEFAULT';

                        // eslint-disable-next-line no-param-reassign
                        element.innerHTML = '<div class="badge-shape-wiz badge-shape-wiz--thumbnail-default badge-shape-wiz--thumbnail-badge" role="img" aria-label="Less than a minute">&lt; 1:00</div>';
                    }
                }
                // no default
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['has-icon', 'href'],
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
        Removed to fix the "Watch Later" and "Add to Queue" buttons, which rely on this event listener

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
