// HTML Ids
export const automaticHTMLKey = 'automatic';
export const desktopHTMLKey = 'desktop';
export const dynamicHTMLKey = 'dynamic';
export const improvePerformanceHTMLKey = 'improve-performance';
export const linkHTMLKey = 'link';

export const i18nKeys: [string, string][] = [
    ['desktop-tooltip', 'desktopTooltip'],
    ['desktop-title', 'desktopTitle'],
    ['automatic-title', 'automaticTitle'],
    ['automatic-description', 'automaticDescription'],
    ['improve-performance-title', 'improvePerformanceTItle'],
    ['improve-performance-description', 'improvePerformanceDescription'],
];

// browser.storage Keys
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

// Runtime selection
// eslint-disable-next-line import/no-mutable-exports
export let runtime = chrome;

try {
    runtime = browser;
    // eslint-disable-next-line no-empty
} catch {}
