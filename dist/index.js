"use strict";
const navButton = document.getElementById('navButton');
const nav = document.getElementById('nav');
const isHidden = nav.classList.contains('nav');
const shouldBeHidden = JSON.parse(localStorage.getItem('nav') ?? String(isHidden));
console.log(`isHidden is ${isHidden}, shouldBeHidden is ${shouldBeHidden}`, localStorage.getItem('nav'));
if (isHidden !== shouldBeHidden) {
    nav.classList.toggle('hidden');
}
navButton.addEventListener('click', () => {
    nav.classList.toggle('hidden');
    localStorage.setItem('nav', JSON.stringify(nav.classList.contains('nav')));
    console.log(`storage is ${localStorage.getItem('nav')}`, nav.classList.contains('hidden'));
});
