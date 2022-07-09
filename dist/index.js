"use strict";
const navButton = document.getElementById('navButton');
const nav = document.getElementById('nav');
const isNavShown = Boolean(nav.classList.contains('nav'));
const shouldBeShown = JSON.parse(localStorage.getItem('nav')) === true;
if (isNavShown === shouldBeShown) {
    nav.classList.toggle('hidden');
}
navButton.addEventListener('click', () => {
    nav.classList.toggle('hidden');
    localStorage.setItem('nav', JSON.stringify(nav.classList.contains('hidden') === false));
});
