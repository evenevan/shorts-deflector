import './button.js';
import './settings.js';

[
    'extensionName',
    'switchToDesktopInterfaceTitle',
    'switchToDesktopInterfaceTooltip',
    'automaticTitle',
    'automaticDescription',
    'improvePerformanceTitle',
    'improvePerformanceDescription',
].forEach((value) => {
    const element = document.getElementById(value);
    element!.textContent = chrome.i18n.getMessage(value);
});