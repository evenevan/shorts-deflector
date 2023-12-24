import './desktop.js';
import './settings.js';
import { i18nKeys, runtime } from '../util/constants.js';

i18nKeys.forEach(([htmlKey, localeKey]) => {
    const element = document.getElementById(htmlKey);
    element!.textContent = runtime.i18n.getMessage(localeKey);
});
