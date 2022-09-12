export {};

const cleanHash = window.location.hash.slice(1);
const selectedHash = document.getElementById(cleanHash) as HTMLAnchorElement;

if (selectedHash) {
    const top = selectedHash.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
        top: top,
    });
}
