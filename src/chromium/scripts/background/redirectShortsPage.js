// This method is better than tabs.update because it doesn't leave the Shorts page in your history
// Using tabs.goBack and then tabs.update, which does solve the history issue, is much slower
export function redirectShortsPage() {
    const cleanURL = window.location.toString().replace('shorts/', 'watch?v=');
    window.location.replace(cleanURL);
}
