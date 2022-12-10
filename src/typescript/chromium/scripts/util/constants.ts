// HTML Ids
export const automaticHTMLKey = 'automatic';
export const desktopHTMLKey = 'desktop-button';
export const desktopLinkHTMLKey = 'desktop-button-link';
export const desktopLoadingHTMLKey = 'desktop-button-loading';
export const improvePerformanceHTMLKey = 'improve-performance';

export const i18nKeys: [string, string][] = [
    ['desktop-button-tooltip', 'desktopButtonTooltip'],
    ['desktop-button-title', 'desktopButtonTitle'],
    ['automatic-title', 'automaticTitle'],
    ['automatic-description', 'automaticDescription'],
    ['improve-performance-title', 'improvePerformanceTItle'],
    ['improve-performance-description', 'improvePerformanceDescription'],
];

// chrome.storage Keys
export const automaticStorageKey = 'automatic';
export const improvePerformanceStorageKey = 'improvePerformance';

// Regex
export const youTubeRegex = /^http(s)?:\/\/www\.youtube\.com/;
export const youTubeShortsRegex = /^http(s)?:\/\/www\.youtube\.com\/shorts\/(.+)$/;

// Rulesets
export const shortsRuleset = 'shorts';

// Hostnames
export const youTubeHostname = 'https://www.youtube.com/*';
export const allHostname = '*://*/*';
