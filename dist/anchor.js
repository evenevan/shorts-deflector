const anchors = document.querySelectorAll('a[href^="#"]');
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const scrollToAnchor = (anchor) => {
    const top = (anchor.getBoundingClientRect().top
        + window.pageYOffset
        - nav.offsetHeight
        - header.offsetHeight);
    window.scrollTo({
        top: top,
        behavior: 'smooth',
    });
};
anchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
        scrollToAnchor(anchor);
    });
});
const selectedAnchor = Object.values(anchors).find((anchor) => anchor.href === document.URL);
if (selectedAnchor) {
    scrollToAnchor(selectedAnchor);
}
export {};
