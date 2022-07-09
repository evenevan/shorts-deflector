"use strict";
const navButton = document.getElementById('navButton');
const nav = document.getElementById('nav');
const navLocalStorage = localStorage.getItem('nav');
const isNavShown = nav.classList.contains('hidden') === false;
const shouldBeShown = navLocalStorage
    ? JSON.parse(navLocalStorage)
    : null;
console.log(isNavShown, shouldBeShown, localStorage.getItem('nav'));
if (isNavShown !== shouldBeShown) {
    nav.classList.toggle('hidden');
}
navButton.addEventListener('click', () => {
    nav.classList.toggle('hidden');
    const state = JSON.stringify(nav.classList.contains('hidden') === false);
    localStorage.setItem('nav', state);
});
