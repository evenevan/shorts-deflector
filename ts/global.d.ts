export {};

declare global {
    const browser: typeof chrome;
}


declare global {
    interface Window {
        browser: typeof chrome
    }
}