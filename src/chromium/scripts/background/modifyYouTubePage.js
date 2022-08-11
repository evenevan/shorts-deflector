export function modifyYouTubePage() {
    const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;
    const observer = new MutationObserver((mutationRecords) => {
        const elements = mutationRecords.filter((mutationRecord) => mutationRecord.type === 'attributes'
            && mutationRecord.target.nodeType === 1).map((mutationRecord) => mutationRecord.target);
        elements.forEach((element) => {
            switch (element.tagName) {
                case 'A':
                    {
                        const anchor = element;
                        if (anchor.href.match(youTubeShortsRegex)) {
                            anchor.href = anchor.href.replace('shorts/', 'watch?v=');
                            anchor.addEventListener('click', (event) => {
                                event.stopImmediatePropagation();
                            }, true);
                        }
                    }
                    break;
                case 'YTD-THUMBNAIL-OVERLAY-TIME-STATUS-RENDERER': {
                    const attribute = element.attributes.getNamedItem('overlay-style');
                    if (attribute) {
                        attribute.value = 'DEFAULT';
                    }
                    // eslint-disable-next-line no-param-reassign
                    element.innerHTML = '<span class="style-scope ytd-thumbnail-overlay-time-status-renderer">< 1:00</span>';
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
            anchor.href = anchor.href.replace('shorts/', 'watch?v=');
            anchor.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
            }, true);
        }
    }
}
