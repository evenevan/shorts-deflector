const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
const header = document.getElementById('header') as HTMLDivElement;
const nav = document.getElementById('nav') as HTMLDivElement;

const scrollToAnchor = (anchor: HTMLAnchorElement) => {
    const top = (
        anchor.getBoundingClientRect().top
        + window.pageYOffset
        - nav.offsetHeight
        - header.offsetHeight
    );

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

const selectedAnchor = Object.values(anchors).find(
    (anchor) => anchor.href === document.URL,
);

if (selectedAnchor) {
    scrollToAnchor(selectedAnchor);
}